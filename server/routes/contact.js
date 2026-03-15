const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Contact form submission route
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save contact message to database
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });
    await contact.save();

    // Send email notification
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to admin email
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Send auto-reply to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <h3>Thank you for contacting us!</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The Team</p>
      `
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
