const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../src/middleware/auth');

// GET all transactions (placeholder)
router.get('/', (req, res) => {
  res.json({ message: 'Transactions endpoint (placeholder)' });
});

// POST create a new transaction
router.post('/', auth, async (req, res) => {
  const { amount, type, category, date, description } = req.body;
  try {
    const transaction = new Transaction({
      user: req.user._id,
      amount,
      type,
      category,
      date,
      description
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// GET a single transaction by id
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// PUT update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
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

// DELETE a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
