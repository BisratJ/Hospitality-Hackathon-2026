const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phoneNumber: { type: String, required: true, trim: true },
  roleType: { type: String, required: true, enum: ['Developer', 'Creative', 'Manager', 'Entrepreneur', 'Other'] },
  ticketNumber: { type: String, unique: true },
  qrCode: { type: String, unique: true }
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  alxAffiliation: { type: String, required: true, enum: ['Learner', 'Graduate', 'Neither'] },
  registrationType: { type: String, required: true, enum: ['individual', 'team'] },
  teamName: { type: String, required: function() { return this.registrationType === 'team'; }, trim: true },
  teamMembers: {
    type: [teamMemberSchema],
    validate: {
      validator: function(members) {
        return this.registrationType !== 'team' || (members.length > 0 && members.length <= 4);
      },
      message: 'Team must have between 1 and 4 additional members'
    }
  },
  strengths: { type: String, required: true, trim: true },
  roleType: { type: String, required: true, enum: ['Developer', 'Creative', 'Manager', 'Entrepreneur', 'Other'] },
  registrationDate: { type: Date, default: Date.now },
  qrCode: { type: String, unique: true },
  ticketNumber: { type: String, unique: true },
  checkInStatus: { type: Boolean, default: false },
  checkInTime: { type: Date }
});

// Add indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ ticketNumber: 1 }, { unique: true });
userSchema.index({ registrationType: 1 });
userSchema.index({ teamName: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
