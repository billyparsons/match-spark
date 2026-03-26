#!/bin/bash
# safe_push.sh — commit and push immediately after a change
# Usage: ~/match-spark/scripts/safe_push.sh "description of what changed"
# Called by subagents after every meaningful file change so nothing is lost on kill.

MSG="${1:-update}"
cd ~/match-spark || exit 1

git add -A
git commit -m "$MSG" || echo "nothing to commit"
git push origin main
echo "pushed: $MSG"
