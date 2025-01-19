import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: String,
  amount: Number,
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
  },
  description: String,
  date: Date,
  recipientId: String,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
}, {
  timestamps: true,
});

// Add index for email lookups
userSchema.index({ email: 1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema); 