const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateTicketNumber, generateQRCode, generateTicketHTML } = require('../utils/ticketing');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to generate and send ticket email
const sendTicketEmail = async (userData, qrCode) => {
  const ticketHtml = generateTicketHTML(userData, qrCode);
  
  // Generate PDF from HTML
  const pdfBuffer = await new Promise((resolve, reject) => {
    pdf.create(ticketHtml).toBuffer((err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });

  // Send email with PDF attachment
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: userData.email,
    subject: 'Your ALX Hackathon Ticket',
    html: `
      <h2>Welcome to ALX Hackathon!</h2>
      <p>Dear ${userData.fullName},</p>
      <p>Thank you for registering for the ALX Hackathon. Your ticket is attached to this email.</p>
      <p>Your ticket number is: ${userData.ticketNumber}</p>
      <p>Please bring this ticket to the event for check-in.</p>
      ${userData.teamName ? `<p>Team: ${userData.teamName}</p>` : ''}
      <p>Best regards,<br>ALX Hackathon Team</p>
    `,
    attachments: [{
      filename: 'hackathon-ticket.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  });
};

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      alxAffiliation,
      registrationType,
      teamName,
      strengths,
      roleType,
      teamMembers
    } = req.body;

    // Check for duplicate emails
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (registrationType === 'team') {
      // Check for duplicate team member emails
      const teamEmails = teamMembers.map(member => member.email);
      teamEmails.push(email);
      const uniqueEmails = new Set(teamEmails);
      if (uniqueEmails.size !== teamEmails.length) {
        return res.status(400).json({ message: 'Duplicate emails found in team members' });
      }

      // Check if any team member email is already registered
      const existingTeamMember = await User.findOne({
        $or: [
          { email: { $in: teamMembers.map(m => m.email) } },
          { 'teamMembers.email': { $in: teamEmails } }
        ]
      });
      if (existingTeamMember) {
        return res.status(400).json({ message: 'One or more team member emails are already registered' });
      }
    }

    // Generate ticket number and QR code for lead/individual
    const ticketNumber = generateTicketNumber();
    const qrCode = await generateQRCode(JSON.stringify({
      ticketNumber,
      name: fullName,
      email,
      registrationType,
      teamName: registrationType === 'team' ? teamName : undefined
    }));

    // Prepare user data
    const userData = {
      fullName,
      phoneNumber,
      email,
      alxAffiliation,
      registrationType,
      teamName: registrationType === 'team' ? teamName : undefined,
      strengths,
      roleType,
      ticketNumber,
      qrCode,
      teamMembers: []
    };

    // If team registration, process team members
    if (registrationType === 'team' && teamMembers?.length > 0) {
      for (const member of teamMembers) {
        if (member.email && member.fullName) { // Skip empty member entries
          const memberTicketNumber = generateTicketNumber();
          const memberQrCode = await generateQRCode(JSON.stringify({
            ticketNumber: memberTicketNumber,
            name: member.fullName,
            email: member.email,
            teamName,
            isTeamMember: true
          }));

          userData.teamMembers.push({
            ...member,
            ticketNumber: memberTicketNumber,
            qrCode: memberQrCode
          });

          // Send ticket email to team member
          await sendTicketEmail({
            fullName: member.fullName,
            email: member.email,
            ticketNumber: memberTicketNumber,
            teamName,
            roleType: member.roleType,
            registrationDate: new Date()
          }, memberQrCode);
        }
      }
    }

    // Create user in database
    const user = new User(userData);
    await user.save();

    // Send ticket email to lead/individual
    await sendTicketEmail(userData, qrCode);

    res.status(201).json({
      message: 'Registration successful',
      ticketNumber
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
});

module.exports = router;
