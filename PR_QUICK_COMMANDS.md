Run these commands locally to push the changes and open a PR (safer branch + PR flow):

# Create branch, commit and push
git checkout -b add-landing-page
git add index.html styles.css script.js README.md PR_DESCRIPTION.md PR_BODY_FULL.md publish-landing.sh package.json .env.example server/index.js server/test/contact.test.js .github/workflows/ci.yml
git commit -m "Add landing page with contact form and Express backend" --author="GitHub Copilot <noreply@github.com>"

git push -u origin add-landing-page

# Create PR using GitHub CLI (if installed)
gh pr create --title "Add landing page with contact form and Express backend" --body-file PR_BODY_FULL.md --base main

# If you prefer to push directly to main (not recommended):
# git add . && git commit -m "Add landing page with contact form and Express backend" && git pull --rebase origin main && git push origin main

# If you want the publish script to do all of this for you:
# chmod +x publish-landing.sh
# ./publish-landing.sh

Notes:
- Ensure you have write access to the repository and that branch protection rules allow pushes.
- If `gh pr create` is not available, open a PR on GitHub using the branch `add-landing-page` and paste the contents of `PR_BODY_FULL.md` into the PR body.
