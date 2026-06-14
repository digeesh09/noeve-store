const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../src/middleware/auth');
const { validateBody } = require('../src/middleware/validate');
const Joi = require('joi');

const subscriptionUpdateSchema = Joi.object({
  service: Joi.string(),
  amount: Joi.number().positive(),
  billingCycle: Joi.string().valid('monthly', 'yearly'),
  nextDue: Joi.date()
});
const subscriptionSchema = Joi.object({
  service: Joi.string().required(),
  amount: Joi.number().positive().required(),
  billingCycle: Joi.string().valid('monthly', 'yearly').required(),
  nextDue: Joi.date().optional()
});

// GET all subscriptions for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user._id });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a subscription by id
router.get('/:id', auth, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Not found' });
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// POST create a new subscription
router.post('/', auth, validateBody(subscriptionSchema), async (req, res) => {
  try {
    const sub = new Subscription({ ...req.body, user: req.user._id });
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update a subscription
router.put('/:id', auth, validateBody(subscriptionUpdateSchema), async (req, res) => {
  try {
    const updated = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE a subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
