#!/usr/bin/env bash
# Runs the Prompts task via `opencode run` using a free model — no billing
# needed. Alternative to trigger-radar.sh (which uses `codex exec`).
#
# BEFORE scheduling this in cron: run it manually once, exactly as shown
# in "Usage" below, and confirm it actually returns to a shell prompt
# (doesn't hang) and that content/radar/<today's date>.json really gets
# created. opencode's non-interactive mode has known open issues where it
# can hang waiting for a permission prompt nobody's there to answer — the
# `timeout` below turns a possible hang into a bounded, reported failure
# instead of a stuck process, but it's still worth confirming a real
# end-to-end success by hand first.
#
# Requires env vars:
#   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   for the result notification
# Requires: `opencode` CLI already installed and configured with the
# model below on this machine.
#
# Usage: TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... ./scripts/trigger-prompts-opencode.sh

set -uo pipefail  # no -e: we want to notify Telegram even on failure

: "${TELEGRAM_BOT_TOKEN:?Set TELEGRAM_BOT_TOKEN}"
: "${TELEGRAM_CHAT_ID:?Set TELEGRAM_CHAT_ID}"

# Same cron-HOME defensiveness as trigger-radar.sh — opencode also stores
# its config/auth under $HOME, so the same class of issue could apply.
if [ -z "${HOME:-}" ] || [ ! -d "${HOME:-/nonexistent}" ]; then
  export HOME
  HOME="$(getent passwd "$(whoami)" 2>/dev/null | cut -d: -f6)"
fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

MODEL="opencode/nemotron-3-ultra-free"
TASK="Follow docs/prompts-task.md (option B) and find a few prompts to add."
TIMEOUT_SECONDS=1200  # 20 min — adjust if a real run legitimately needs longer

{
  echo "--- $(date -Is) ---"
  echo "HOME=$HOME  whoami=$(whoami)  opencode=$(command -v opencode || echo NOT FOUND)  model=$MODEL"
} >&2

OUTPUT=$(timeout "$TIMEOUT_SECONDS" opencode run --model "$MODEL" --dangerously-skip-permissions "$TASK" 2>&1)
STATUS=$?

if [ $STATUS -eq 124 ]; then
  SUMMARY="⏱️ Prompts timed out after $((TIMEOUT_SECONDS / 60))min, $(date +%Y-%m-%d) — likely hung on a prompt. Killed it, nothing committed."
elif [ $STATUS -eq 0 ]; then
  SUMMARY="✅ Prompts ran ($(date +%Y-%m-%d)).
$(echo "$OUTPUT" | tail -c 600)"
else
  SUMMARY="❌ Prompts failed, exit $STATUS ($(date +%Y-%m-%d)).
$(echo "$OUTPUT" | tail -c 600)"
fi

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  --data-urlencode text="$SUMMARY" > /dev/null

exit $STATUS
