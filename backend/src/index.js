const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

const authRoutes = require('../routes/auth');
const transactionRoutes = require('../routes/transactions');
const loanRoutes = require('../routes/loans');
const investmentRoutes = require('../routes/investments');
const creditCardRoutes = require('../routes/creditCards');
const subscriptionRoutes = require('../routes/subscriptions');
const insightsRoutes = require('../routes/insights');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Logging middleware
app.use(morgan('combined'));
// Rate limiting middleware
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', async (req, res) => {
  try {
    let stats = {};
    if (mongoose.connection && mongoose.connection.db) {
      stats = await mongoose.connection.db.stats();
    }
    res.json({ status: 'ok', dbStats: stats });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Mount API routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/loans', loanRoutes);
app.use('/investments', investmentRoutes);
app.use('/creditCards', creditCardRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/insights', insightsRoutes);


const PORT = process.env.PORT || 5000;
if (require.main === module) {
  connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}

