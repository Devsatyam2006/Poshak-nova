const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);




module.exports = UserModel;

