const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  amount: { type: Number, required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
  nextDue: { type: Date, optional: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
