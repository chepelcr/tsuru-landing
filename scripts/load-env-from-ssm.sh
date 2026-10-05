#!/usr/bin/env bash
# Materialize the landing's public build configuration from SSM.
# Usage: bash scripts/load-env-from-ssm.sh [environment] [profile|-] [--output path|--github-env]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENVIRONMENT="${1:-dev}"
AWS_PROFILE_NAME="${2:-${AWS_PROFILE:-PACIFIC-PROD}}"
if [[ $# -gt 0 ]]; then shift; fi
if [[ $# -gt 0 ]]; then shift; fi

OUTPUT_FILE="${REPO_ROOT}/.env.local"
OUTPUT_MODE="replace"
if [[ "${1:-}" == "--output" ]]; then
  [[ -n "${2:-}" ]] || { echo "--output requires a path" >&2; exit 2; }
  OUTPUT_FILE="$2"
elif [[ "${1:-}" == "--github-env" ]]; then
  [[ -n "${GITHUB_ENV:-}" ]] || { echo "GITHUB_ENV is not set" >&2; exit 2; }
  OUTPUT_FILE="${GITHUB_ENV}"
  OUTPUT_MODE="append"
elif [[ $# -gt 0 ]]; then
  echo "Unknown argument: $1" >&2
  exit 2
fi

case "${ENVIRONMENT}" in
  dev|stag|prod) ;;
  *) echo "Environment must be dev, stag, or prod" >&2; exit 2 ;;
esac

DEPLOY_REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"
BASE_PATH="/tsuru/${ENVIRONMENT}/landing"
AWS_ARGS=(--region "${DEPLOY_REGION}")
if [[ -n "${AWS_PROFILE_NAME}" && "${AWS_PROFILE_NAME}" != "-" ]]; then
  AWS_ARGS+=(--profile "${AWS_PROFILE_NAME}")
fi

echo "Resolving landing configuration from ${BASE_PATH}..."
PARAMS="$(aws ssm get-parameters-by-path \
  --path "${BASE_PATH}" \
  --recursive \
  --query 'Parameters[].[Name,Value]' \
  --output text \
  "${AWS_ARGS[@]}")"

get_parameter() {
  local key="$1"
  awk -F '\t' -v name="${BASE_PATH}/${key}" \
    '$1 == name { print $2; found=1 } END { exit !found }' <<<"${PARAMS}"
}

CONFIG_LINES=()
MISSING=0
while IFS=':' read -r variable key; do
  if value="$(get_parameter "${key}")"; then
    if [[ "${value}" == *$'\n'* || "${value}" == *$'\r'* ]]; then
      echo "Invalid multiline value in ${BASE_PATH}/${key}" >&2
      exit 1
    fi
    CONFIG_LINES+=("${variable}=${value}")
    echo "  ${variable} <- ${BASE_PATH}/${key}"
  else
    echo "Missing required parameter ${BASE_PATH}/${key}" >&2
    MISSING=1
  fi
done <<'EOF'
VITE_AWS_REGION:aws/region
VITE_PUBLIC_API_URL:api/public-url
VITE_PUBLIC_IDENTITY_POOL_ID:cognito/public-identity-pool-id
EOF

[[ "${MISSING}" -eq 0 ]] || exit 1

umask 077
if [[ "${OUTPUT_MODE}" == "append" ]]; then
  printf '%s\n' "${CONFIG_LINES[@]}" >> "${OUTPUT_FILE}"
else
  mkdir -p "$(dirname "${OUTPUT_FILE}")"
  TEMP_FILE="$(mktemp "${OUTPUT_FILE}.tmp.XXXXXX")"
  {
    printf '# Generated from %s; do not edit or commit.\n' "${BASE_PATH}"
    printf '%s\n' "${CONFIG_LINES[@]}"
  } > "${TEMP_FILE}"
  mv "${TEMP_FILE}" "${OUTPUT_FILE}"
fi

echo "Landing environment written to ${OUTPUT_FILE}."
