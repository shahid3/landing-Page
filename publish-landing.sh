#!/usr/bin/env bash
set -euo pipefail

# Usage: ./publish-landing.sh [branch-name]
BRANCH="${1:-add-landing-page}"
FILES=(index.html styles.css script.js README.md PR_DESCRIPTION.md package.json .env.example server/index.js server/test/contact.test.js)
COMMIT_MSG="Add landing page with contact form"
AUTHOR="GitHub Copilot <noreply@github.com>"

# Ensure we're in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this directory is not a git repository. Run this from the repo root."
  exit 1
fi

echo "Creating branch: $BRANCH"
# Fetch latest refs
git fetch origin

# Create and switch to branch
git checkout -b "$BRANCH"

# Stage files (will only add those that exist)
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    git add "$f"
  fi
done

# Commit
if git diff --cached --quiet; then
  echo "No staged changes to commit. Exiting."
  exit 0
fi

git commit -m "$COMMIT_MSG" --author="$AUTHOR"

# Push
git push -u origin "$BRANCH"

echo "Branch pushed: $BRANCH"

# Create PR with GitHub CLI if available
if command -v gh >/dev/null 2>&1; then
  echo "Creating PR using gh..."
  # Use PR_DESCRIPTION.md if present
  if [ -f PR_BODY_FULL.md ]; then
    gh pr create --title "$COMMIT_MSG" --body-file PR_BODY_FULL.md --base main
  elif [ -f PR_DESCRIPTION.md ]; then
    gh pr create --title "$COMMIT_MSG" --body-file PR_DESCRIPTION.md --base main
  else
    gh pr create --title "$COMMIT_MSG" --body "Adds responsive landing page with contact form and Express backend." --base main
  fi
  echo "PR created. Open it with: gh pr view --web"
else
  echo "gh CLI not found. You can create a PR manually or install gh: https://cli.github.com/"
  echo "Create a PR from branch '$BRANCH' against 'main' in the GitHub UI."
fi
