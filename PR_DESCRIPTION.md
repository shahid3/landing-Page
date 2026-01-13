Adds a responsive landing page for Crystal Clear Window Cleaning with:

- `index.html` — hero, services, about, testimonials, and contact form
- `styles.css` — responsive styling
- `script.js` — client-side validation + fetch submission to form action

Preview locally: `python -m http.server 8000` and open `http://localhost:8000`.

Notes:
- The contact form currently uses a placeholder Formspree endpoint (`https://formspree.io/f/your-form-id`). If the placeholder is present, the client will fall back to `POST /api/contact` on the local Express server.

New files added for backend:
- `server/index.js` — small Express app that serves static files and exposes `POST /api/contact` (validates input and sends email via SMTP if configured)
- `package.json` — scripts to run the server (`npm start`, `npm run dev`)
- `.env.example` — example environment variables for SMTP and contact recipient

Checklist:
- [ ] Verify contact form integration (Formspree or backend)
- [ ] Add real phone number and email in `index.html`
- [ ] Provide SMTP credentials and set `CONTACT_TO` in `.env` for production
- [ ] Add images or gallery assets if desired
- [ ] Verify CI runs tests on PR (GitHub Actions added)

If you'd like, I can wire this to an SMTP service like SendGrid or Mailgun and add more end-to-end tests. 🎯