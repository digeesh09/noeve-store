const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const auth = require('../src/middleware/auth');
const { validateBody } = require('../src/middleware/validate');
const Joi = require('joi');

// Joi schema for investment validation
const investmentSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('stock', 'bond', 'fund', 'realEstate', 'other').required(),
  amount: Joi.number().positive().required(),
  purchaseDate: Joi.date().optional(),
  note: Joi.string().optional()
});

// GET all investments for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single investment by id
router.get('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.user._id });
    if (!investment) return res.status(404).json({ message: 'Not found' });
    res.json(investment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// POST create a new investment
router.post('/', auth, validateBody(investmentSchema), async (req, res) => {
  try {
    const investment = new Investment({ ...req.body, user: req.user._id });
    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update an investment
router.put('/:id', auth, validateBody(investmentSchema), async (req, res) => {
  try {
    const updated = await Investment.findOneAndUpdate(
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

// DELETE an investment
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Investment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
