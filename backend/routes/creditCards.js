const express = require('express');
const router = express.Router();
const CreditCard = require('../models/CreditCard');
const auth = require('../src/middleware/auth');
const { validateBody } = require('../src/middleware/validate');
const Joi = require('joi');

// Joi schema for credit card validation
const creditCardSchema = Joi.object({
  cardNumber: Joi.string().required(),
  limit: Joi.number().positive().required(),
  balance: Joi.number().min(0).optional(),
  dueDate: Joi.date().optional(),
  interestRate: Joi.number().optional()
});

// Update schema allowing partial fields
const creditCardUpdateSchema = Joi.object({
  cardNumber: Joi.string(),
  limit: Joi.number().positive(),
  balance: Joi.number().min(0),
  dueDate: Joi.date(),
  interestRate: Joi.number()
});

// GET all credit cards for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const cards = await CreditCard.find({ user: req.user._id });
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single credit card by id
router.get('/:id', auth, async (req, res) => {
  try {
    const card = await CreditCard.findOne({ _id: req.params.id, user: req.user._id });
    if (!card) return res.status(404).json({ message: 'Not found' });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// POST create a new credit card
router.post('/', auth, validateBody(creditCardSchema), async (req, res) => {
  try {
    const card = new CreditCard({ ...req.body, user: req.user._id });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update a credit card
router.put('/:id', auth, validateBody(creditCardUpdateSchema), async (req, res) => {
  try {
    const updated = await CreditCard.findOneAndUpdate(
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

// DELETE a credit card
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await CreditCard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
