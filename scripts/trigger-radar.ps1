# Sends a message to your OpenDray Telegram bot, exactly as if you'd typed
# it — so the run shows up in Telegram like any manual trigger does.
# Meant to be called from Windows Task Scheduler, not run by hand every day.
#
# Requires env vars TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to be set
# (Task Scheduler action can set these, or set them as system env vars).
#
# Usage: powershell -File scripts\trigger-radar.ps1

$ErrorActionPreference = "Stop"

if (-not $env:TELEGRAM_BOT_TOKEN) { throw "Set TELEGRAM_BOT_TOKEN" }
if (-not $env:TELEGRAM_CHAT_ID) { throw "Set TELEGRAM_CHAT_ID" }

$message = "Follow docs/radar-task.md and run today's radar."
$uri = "https://api.telegram.org/bot$($env:TELEGRAM_BOT_TOKEN)/sendMessage"

$response = Invoke-RestMethod -Uri $uri -Method Post -Body @{
    chat_id = $env:TELEGRAM_CHAT_ID
    text    = $message
}

if ($response.ok) {
    Write-Output "Sent: $message"
} else {
    Write-Error "Telegram API error: $($response | ConvertTo-Json -Compress)"
    exit 1
}
