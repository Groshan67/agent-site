#!/usr/bin/env bash
# Sends a message to your OpenDray Telegram bot, exactly as if you'd typed
# it — so the run shows up in Telegram like any manual trigger does.
# Meant to be called from cron/systemd/Task Scheduler, not run by hand
# every day.
#
# Requires env vars:
#   TELEGRAM_BOT_TOKEN   the token BotFather gave you
#   TELEGRAM_CHAT_ID     your chat id with the bot (see README below)
#
# Usage: TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... ./scripts/trigger-radar.sh

set -euo pipefail

ENV_FILE="$HOME/.config/agent-site/telegram.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

: "${TELEGRAM_BOT_TOKEN:?Set TELEGRAM_BOT_TOKEN}"
: "${TELEGRAM_CHAT_ID:?Set TELEGRAM_CHAT_ID}"


MESSAGE="Follow docs/radar-task.md and run today's radar."

response=$(curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  --data-urlencode text="${MESSAGE}")

if echo "$response" | grep -q '"ok":true'; then
  echo "Sent: $MESSAGE"
else
  echo "Telegram API error: $response" >&2
  exit 1
fi
