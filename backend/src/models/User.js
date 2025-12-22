const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
passwordHash: { type: String, required: true },
walletAddress: { type: String, default: '' }, // reserved for Web3
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', UserSchema);