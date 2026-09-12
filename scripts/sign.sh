#!/bin/bash
# Sign the Multi-Search extension as UNLISTED via AMO (addons.mozilla.org).
# Unlisted = no public AMO page; you distribute the signed xpi yourself
# (GitHub release + updates.json keeps working for unlisted add-ons).
#
# Prerequisites (one-time):
#   1. Account at https://addons.mozilla.org/developers/
#   2. API keys: https://addons.mozilla.org/developers/addon/api/key/
#      -> put them in ~/.amo-credentials as:
#         AMO_JWT_ISSUER=your-issuer
#         AMO_JWT_SECRET=your-secret
#
# Usage: ./sign.sh [version]   (version defaults to manifest.json's version)

set -euo pipefail

export PATH="/opt/homebrew/bin:$PATH"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# Load credentials
if [ -f "$HOME/.amo-credentials" ]; then
  set -a; source "$HOME/.amo-credentials"; set +a
fi
: "${AMO_JWT_ISSUER:?AMO_JWT_ISSUER not set — put your AMO API keys in ~/.amo-credentials}"
: "${AMO_JWT_SECRET:?AMO_JWT_SECRET not set — put your AMO API keys in ~/.amo-credentials}"

VERSION="${1:-$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")}"
XPI="multi-search-plugin-${VERSION}.xpi"

echo "==> Building $XPI from source..."
rm -f "$XPI"
zip -r "$XPI" manifest.json background.js sidebar/ settings/ sites/ storage/ utils/ icons/ \
  -x "node_modules/*" "tests/*" "package*.json" "*.md" ".git/*" "scripts/*" "updates.json" "dist/*" > /dev/null

echo "==> Submitting to AMO for UNLISTED signing (channel: unlisted)..."
# --channel unlisted: no public listing; --amo-metadata not needed
# web-ext sign polls until signed (automated validation usually minutes, up to 24h)
web-ext sign \
  --channel unlisted \
  --api-key "$AMO_JWT_ISSUER" \
  --api-secret "$AMO_JWT_SECRET" \
  --source-dir "$REPO_DIR" \
  --artifacts-dir "$REPO_DIR/dist"

echo ""
echo "==> Signed xpi(s) in dist/ — attach the LATEST one to the GitHub release:"
echo "    gh release upload v${VERSION} dist/*-signed.xpi --clobber"
