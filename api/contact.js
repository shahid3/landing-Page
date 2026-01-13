const nodemailer = require('nodemailer');

// Vercel Serverless Function: POST /api/contact
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body || {};

    // Honeypot
    if (data._gotcha) {
      return res.status(200).json({ success: true, message: 'OK' });
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

    // If SMTP not configured, log and return success for local/dev
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Vercel API contact received (no SMTP configured):', { name, email, phone, service, message });
      return res.json({ success: true, message: 'Message received (no SMTP configured).' });
    }

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
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};