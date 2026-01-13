# landing-Page

Crystal Clear Window Cleaning — premium responsive landing page with a modern design and contact form.

## What’s included ✅

- `index.html` — the landing page (hero, services, testimonials, contact form)
- `styles.css` — responsive styles
- `script.js` — form validation + submission logic (uses Fetch API)

## Local preview 🔧

Open `index.html` in your browser to preview the site locally. For a better local server experience (helps with some browsers' restrictions), run a simple static server:

- Python 3: `python -m http.server 8000` then open `http://localhost:8000`
- Node: `npx serve .`

## Contact form setup 💬

The form currently points to Formspree as an example: `action="https://formspree.io/f/your-form-id"`.

- Replace that URL with your Formspree form endpoint, or
- Replace with your own server endpoint that accepts `multipart/form-data` POSTs.

Form submissions are sent via `fetch` in `script.js` so the page can show a success/failure message without a full page reload.

### Local backend (Express) 🔧

If you prefer a self-hosted backend, this repo includes a small Express server at `server/index.js` that exposes `POST /api/contact`.

How to run:

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in SMTP settings (optional): `cp .env.example .env`
3. Start server: `npm run dev` (requires `nodemon`) or `npm start`

Notes:
- If the contact form `action` still points to the Formspree placeholder (contains `your-form-id`), `script.js` will automatically send the submission to `/api/contact`.

### Vercel Serverless Function

This repo includes a Vercel Serverless Function at `api/contact.js` that handles `POST /api/contact`. It validates inputs, supports a honeypot field, and sends email via SMTP using the following environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (true/false)
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO`

If SMTP variables are not set, the function will log the messages to the Vercel function logs for testing.

To set the environment variables in Vercel: go to your Vercel project → Settings → Environment Variables and add the variables above for the Production environment.

- The serverless function runs on the same deployment, so no extra hosting is required.
- Locally you can still run the Express server for development (`npm run dev`) or run the function using `vercel dev` if you have the Vercel CLI installed.

## Deploying 📤

This is a static site and can be hosted on GitHub Pages, Netlify, Vercel, or any static host.

## Customization Tips ✨

- Update brand text, phone, and email in `index.html`.
- Tweak colors and spacing in `styles.css`.
- Add your Formspree ID or backend endpoint to the form `action` attribute.

---

If you want, I can add a small Express server to handle form submissions (for self-hosted deployments) or integrate with a chosen form provider — tell me which option you prefer and I’ll add it. 🎯
