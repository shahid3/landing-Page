### Summary

Adds a responsive landing page and a small Express backend to handle contact form submissions.

### What I changed

- `index.html`, `styles.css`, `script.js` — landing page (hero, services, about, testimonials, contact form). Client sends submissions via Fetch.
- `api/contact.js` — Vercel Serverless Function handling `POST /api/contact` (validates input and sends email via SMTP when configured)
- `server/index.js` — Express server (kept for local development) exposing `POST /api/contact` with similar behavior
- `package.json` — scripts to run the server and run tests.
- `.env.example` — example SMTP variables and `CONTACT_TO` for production.
- `api/contact.test.js` & `server/test/contact.test.js` — basic tests using `supertest` and `jest`.
- `.github/workflows/ci.yml` — CI that runs tests on PRs.
- `publish-landing.sh` — helper script to create a branch, commit, push, and create a PR with `gh` (updated to include api files).
- `PR_DESCRIPTION.md` — short PR body and checklist.

### How to test locally

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start server: `npm run dev` (requires `nodemon`) or `npm start`
4. Open: `http://localhost:3000` and submit the contact form. If SMTP is not configured, messages are logged to the server console.

### Notes

- The client will send to `/api/contact` when the form action still points to the Formspree placeholder (`your-form-id`). Otherwise it sends to whatever `action` is configured on the form.
- To receive real emails, populate `.env` using `.env.example` and set SMTP credentials and `CONTACT_TO`.

If you want, I can open the PR for you (requires pushing from your machine or from a CI account) — run `chmod +x publish-landing.sh && ./publish-landing.sh` locally to push and create the PR (if `gh` is installed).