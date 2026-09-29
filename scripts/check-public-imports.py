"""Fail when public runtime code imports checked-in editorial JSON."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "src"
allowed = {root / "lib" / "admin-store.ts", root / "repositories" / "blog.repository.ts"}
pattern = re.compile(r"^\s*import\s+(?!type\b).*?from\s*['\"]@/(?:content|translations)/.*?\.json['\"]", re.MULTILINE)
violations = []
for path in root.rglob("*"):
    if path.suffix not in {".ts", ".tsx"} or path in allowed or "admin" in path.parts:
        continue
    if pattern.search(path.read_text()):
        violations.append(str(path.relative_to(root)))
if violations:
    raise SystemExit("Public JSON imports are forbidden: " + ", ".join(violations))
print("Public runtime has no editorial JSON imports")
