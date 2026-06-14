const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const auth = require('../src/middleware/auth');
const { validateBody } = require('../src/middleware/validate');
const Joi = require('joi');

// Joi schema for loan creation / update
const loanSchema = Joi.object({
  amount: Joi.number().positive().required(),
  interestRate: Joi.number().positive().required(),
  termMonths: Joi.number().integer().positive().required(),
  startDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'paid', 'defaulted').optional()
});

// Update schema allowing partial fields
const loanUpdateSchema = Joi.object({
  amount: Joi.number().positive(),
  interestRate: Joi.number().positive(),
  termMonths: Joi.number().integer().positive(),
  startDate: Joi.date(),
  status: Joi.string().valid('active', 'paid', 'defaulted')
});

// GET all loans for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new loan
router.post('/', auth, validateBody(loanSchema), async (req, res) => {
  try {
    const loan = new Loan({ ...req.body, user: req.user._id });
    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// GET a specific loan
router.get('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, user: req.user._id });
    if (!loan) return res.status(404).json({ message: 'Not found' });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// PUT update a loan
router.put('/:id', auth, validateBody(loanUpdateSchema), async (req, res) => {
  try {
    const updated = await Loan.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE a loan
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
