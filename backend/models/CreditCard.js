const mongoose = require('mongoose');

const CreditCardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardNumber: { type: String, required: true }, // e.g., 4111111111111111
  limit: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  dueDate: { type: Date },
  interestRate: { type: Number } // APR percent
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', CreditCardSchema);
