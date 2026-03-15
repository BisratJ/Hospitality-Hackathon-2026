const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get check-in statistics
router.get('/checkin/stats', async (req, res) => {
  try {
    const totalRegistered = await User.countDocuments();
    const checkedIn = await User.countDocuments({ checkInStatus: true });
    
    res.json({
      total: totalRegistered,
      checkedIn: checkedIn,
      remaining: totalRegistered - checkedIn
    });
  } catch (error) {
    console.error('Error getting check-in stats:', error);
    res.status(500).json({ message: 'Error getting check-in statistics' });
  }
});

// Check-in a participant
router.post('/checkin', async (req, res) => {
  try {
    const { ticketNumber } = req.body;
    
    const user = await User.findOne({ ticketNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'Invalid ticket number' });
    }
    
    if (user.checkInStatus) {
      return res.status(400).json({ 
        message: 'Already checked in',
        checkInTime: user.checkInTime
      });
    }
    
    user.checkInStatus = true;
    user.checkInTime = new Date();
    await user.save();
    
    res.json({
      message: 'Check-in successful',
      user: {
        fullName: user.fullName,
        email: user.email,
        ticketNumber: user.ticketNumber,
        checkInTime: user.checkInTime
      }
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Error processing check-in' });
  }
});

// Verify ticket
router.get('/checkin/verify/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const user = await User.findOne({ ticketNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'Invalid ticket number' });
    }
    
    res.json({
      valid: true,
      user: {
        fullName: user.fullName,
        email: user.email,
        ticketNumber: user.ticketNumber,
        checkInStatus: user.checkInStatus,
        checkInTime: user.checkInTime
      }
    });
  } catch (error) {
    console.error('Error verifying ticket:', error);
    res.status(500).json({ message: 'Error verifying ticket' });
  }
});

module.exports = router;
