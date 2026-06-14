const Joi = require('joi');

/**
 * Validation middleware generator.
 * @param {Joi.ObjectSchema} schema - Joi schema to validate request body against.
 * @returns Express middleware function.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => d.message);
      return res.status(400).json({ message: 'Invalid request data', details });
    }
    req.body = value; // use sanitized value
    next();
  };
}

module.exports = { validateBody };
