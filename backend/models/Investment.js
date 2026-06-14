const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['stock', 'bond', 'fund', 'realEstate', 'other'], required: true },
  amount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Investment', InvestmentSchema);
