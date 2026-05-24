#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
set -a; [ -f .env.trillionx.safe ] && . ./.env.trillionx.safe; set +a
echo "TRILLIONX SAFE START PORT=${PORT:-3000} MEM=${TRILLIONX_MEMORY_LIMIT_MB:-4096}"
node --max-old-space-size="${TRILLIONX_MEMORY_LIMIT_MB:-4096}" app.js
