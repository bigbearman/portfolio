#!/usr/bin/env bash
set -e

MSG="${1:-update portfolio}"

npm run build

git add app/ components/ content.ts public/ functions/api/contact.js \
        wrangler.jsonc next.config.ts tsconfig.json package.json package-lock.json \
        .gitignore

git diff --cached --quiet && echo "Nothing to commit." && exit 0

git commit -m "$MSG"
git push origin main

wrangler pages deploy out --project-name portfolio --branch main
