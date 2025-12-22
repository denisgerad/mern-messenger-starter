const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
passwordHash: { type: String, required: true },
isVerified: { type: Boolean, default: false },
verificationToken: { type: String },
verificationTokenExpires: { type: Date },
walletAddress: { type: String, default: '' }, // reserved for Web3
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', UserSchema);