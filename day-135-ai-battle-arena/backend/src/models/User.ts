import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  verification_token: { type: String },
  password_reset_token: { type: String, default: null },
  password_reset_expires: { type: Date, default: null },
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
