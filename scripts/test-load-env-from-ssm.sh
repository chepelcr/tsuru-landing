#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(mktemp -d)"
trap 'rm -rf "${TEST_DIR}"' EXIT

mkdir -p "${TEST_DIR}/bin"
MOCK_AWS="${TEST_DIR}/bin/aws"
cat > "${MOCK_AWS}" <<'EOF'
#!/usr/bin/env bash
if [[ "${TEST_MISSING:-}" == "true" ]]; then exit 0; fi
cat <<'PARAMS'
/tsuru/dev/landing/aws/region	us-east-1
/tsuru/dev/landing/api/public-url	https://public-api.example.test
/tsuru/dev/landing/cognito/public-identity-pool-id	us-east-1:pool-id
PARAMS
EOF
chmod +x "${MOCK_AWS}"

OUTPUT_FILE="${TEST_DIR}/landing.env"
PATH="${TEST_DIR}/bin:${PATH}" \
  bash "${SCRIPT_DIR}/load-env-from-ssm.sh" dev test-profile --output "${OUTPUT_FILE}"

grep -qx 'VITE_AWS_REGION=us-east-1' "${OUTPUT_FILE}"
grep -qx 'VITE_PUBLIC_API_URL=https://public-api.example.test' "${OUTPUT_FILE}"
grep -qx 'VITE_PUBLIC_IDENTITY_POOL_ID=us-east-1:pool-id' "${OUTPUT_FILE}"

cp "${OUTPUT_FILE}" "${TEST_DIR}/original.env"
if TEST_MISSING=true PATH="${TEST_DIR}/bin:${PATH}" bash "${SCRIPT_DIR}/load-env-from-ssm.sh" dev test-profile --output "${OUTPUT_FILE}"; then
  echo "Missing required parameters must fail" >&2
  exit 1
fi
cmp "${OUTPUT_FILE}" "${TEST_DIR}/original.env"
echo "SSM environment loader success and missing-parameter tests passed."
