const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30, message: { error: 'Too many requests, please try again later.' } });
app.use('/api/', limiter);

// Serve static files (the landing page)
app.use(express.static(path.join(__dirname, '..')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  try {
    const data = req.body || {};
    // In case of multipart/form-data, body parser may not fill fields; express.urlencoded handles it

    // Honeypot
    if (data._gotcha) {
      return res.status(200).json({ success: true, message: 'OK' }); // silently accept spam
    }

    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const message = (data.message || '').trim();
    const phone = (data.phone || '').trim();
    const service = (data.service || '').trim();

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const to = process.env.CONTACT_TO || process.env.SMTP_USER || 'no-reply@example.com';
    const subject = `New contact from ${name} (${service || 'General Inquiry'})`;

    const html = `
      <h3>New contact request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

    // If SMTP not configured, log and return success (useful for local dev)
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Contact received (no SMTP configured):', { name, email, phone, service, message });
      return res.json({ success: true, message: 'Message received (no SMTP configured).' });
    }

    // Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = {
      from: `${name} <${email}>`,
      to,
      subject,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`,
      html
    };

    await transporter.sendMail(mail);

    return res.json({ success: true, message: 'Message sent.' });
  } catch (err) {
    console.error('Error handling contact:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
