const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

// Generate a unique ticket number
const generateTicketNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ALX-${timestamp}-${random}`.toUpperCase();
};

// Generate QR code as data URL
const generateQRCode = async (data) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data);
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Generate ticket HTML
const generateTicketHTML = (user, qrCodeDataUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ALX Hackathon Ticket</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .ticket {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .ticket-header {
          background: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .ticket-content {
          padding: 20px;
        }
        .ticket-info {
          margin: 20px 0;
        }
        .ticket-info p {
          margin: 10px 0;
          color: #4a5568;
        }
        .ticket-qr {
          text-align: center;
          margin: 20px 0;
        }
        .ticket-qr img {
          max-width: 200px;
        }
        .ticket-footer {
          text-align: center;
          padding: 20px;
          background: #f7fafc;
          font-size: 0.9em;
          color: #718096;
        }
        .team-info {
          background: #ebf4ff;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="ticket-header">
          <h1>ALX Hackathon Ticket</h1>
        </div>
        <div class="ticket-content">
          <div class="ticket-info">
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phoneNumber}</p>
            <p><strong>Ticket Number:</strong> ${user.ticketNumber}</p>
            <p><strong>Role:</strong> ${user.roleType}</p>
            <div class="team-info">
              <p><strong>Team:</strong> ${user.teamName || 'N/A'}</p>
            </div>
          </div>
          <div class="ticket-qr">
            <img src="${qrCodeDataUrl}" alt="QR Code">
            <p>Scan this QR code at the venue for check-in</p>
          </div>
        </div>
        <div class="ticket-footer">
          <p>Date: ${new Date(user.registrationDate).toLocaleDateString()}</p>
          <p>Please bring this ticket and a valid ID to the event</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateTicketNumber,
  generateQRCode,
  generateTicketHTML
};
