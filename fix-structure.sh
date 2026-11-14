#!/usr/bin/env bash
# Rakgadi Eatery - safe structure fix
# Run from the ROOT of the repo (the folder that contains .git)
#
# What it does:
#   1. Safety checks + makes a backup branch
#   2. Stops git tracking node_modules (and deletes the folders)
#   3. Flattens frontend/frontend  ->  frontend
#   4. Merges the extra packages into the app's package.json
#   5. Adds a root .gitignore, removes stray lock files
#   6. Reinstalls once -> one package-lock.json
#   7. Commits (asks before pushing)

set -euo pipefail

say()  { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mSTOP: %s\033[0m\n' "$*"; exit 1; }

# ---------- 1. Safety checks ----------
say "Checking where we are"
[ -d .git ] || fail "Run this from the repo root (the folder that contains .git)."
[ -d frontend/frontend/src ] || fail "frontend/frontend/src not found. Looks like the folders are already fixed or different."
command -v node >/dev/null || fail "Node.js is not installed."
command -v npm  >/dev/null || fail "npm is not installed."

if [ -n "$(git status --porcelain)" ]; then
  fail "You have uncommitted changes. Commit or stash them first, then run again."
fi

say "Pulling latest"
git pull --ff-only

BACKUP="backup-before-flatten-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP"
echo "Backup branch created: $BACKUP  (your old layout is safe there)"

# ---------- 2. Stop tracking node_modules ----------
say "Removing node_modules from git tracking"
git rm -r -q --cached --ignore-unmatch frontend/node_modules frontend/frontend/node_modules
rm -rf frontend/node_modules frontend/frontend/node_modules

# ---------- 3. Flatten frontend/frontend -> frontend ----------
say "Flattening frontend/frontend into frontend"
git mv frontend _old_frontend
git mv _old_frontend/frontend frontend

# ---------- 4. Merge the extra packages into the app ----------
say "Merging extra packages into frontend/package.json"
node -e '
const fs = require("fs");
const outer = JSON.parse(fs.readFileSync("_old_frontend/package.json", "utf8"));
const appPath = "frontend/package.json";
const app = JSON.parse(fs.readFileSync(appPath, "utf8"));
app.dependencies = Object.assign({}, app.dependencies, outer.dependencies || {});
app.dependencies = Object.fromEntries(Object.entries(app.dependencies).sort());
fs.writeFileSync(appPath, JSON.stringify(app, null, 2) + "\n");
console.log("Dependencies now:", Object.keys(app.dependencies).join(", "));
'

# ---------- 5. Clean up leftovers ----------
say "Cleaning up leftover files"
git rm -r -q -f --ignore-unmatch _old_frontend
rm -rf _old_frontend

# Stray lock file at repo root (only remove if it holds no packages)
if [ -f package-lock.json ] && ! grep -q '"node_modules/' package-lock.json; then
  git rm -q -f package-lock.json
  echo "Removed empty root package-lock.json"
fi

# Remove the app's old lock file so we get one fresh, correct one
rm -f frontend/package-lock.json
git rm -q --cached --ignore-unmatch frontend/package-lock.json

# Root .gitignore
touch .gitignore
for line in "node_modules/" ".next/" ".env" ".env.local" ".env*.local" ".DS_Store"; do
  grep -qxF "$line" .gitignore || echo "$line" >> .gitignore
done

# ---------- 6. Fresh install ----------
say "Installing packages (one time)"
( cd frontend && npm install --no-audit --no-fund )

# ---------- 7. Commit ----------
say "Committing"
git add -A
git commit -q -m "fix: untrack node_modules, flatten frontend folder, merge dependencies"

TRACKED=$(git ls-files | grep -c 'node_modules' || true)
say "Result"
echo "node_modules files still tracked: $TRACKED   (should be 0)"
echo "package.json files:"
git ls-files | grep 'package.json$' || true
echo "lock files:"
git ls-files | grep 'package-lock.json$' || true

echo
read -r -p "Push to GitHub now? (y/n) " ANSWER
if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "Y" ]; then
  git push
  echo "Pushed."
else
  echo "Not pushed. When ready, run:  git push"
fi

say "Done. To test Next.js:  cd frontend && npm run dev   then open http://localhost:3000"
echo "If anything looks wrong, go back with:  git reset --hard $BACKUP"
