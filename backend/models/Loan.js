const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true }, // annual percentage
  termMonths: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'paid', 'defaulted'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
