#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" != "main" ]; then
  echo "Error: Current branch not 'main'. Release impossible you are on '$current_branch'."
  exit 1
fi

echo "Current branch — 'main'."
exit 0
