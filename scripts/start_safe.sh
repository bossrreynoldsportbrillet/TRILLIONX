#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
set -a; [ -f .env.trillionx.safe ] && . ./.env.trillionx.safe; set +a
MEM=${TRILLIONX_MEMORY_LIMIT_MB:-4096}; echo "TRILLIONX SAFE PORT=${PORT:-3000} WORKERS=${TRILLIONX_MAX_WORKERS:-2} PORTS=${TRILLIONX_MAX_PORT_PROCESSES:-24} MEM=$MEM"
node --max-old-space-size="$MEM" app.js
