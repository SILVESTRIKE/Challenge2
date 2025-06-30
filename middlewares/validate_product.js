module.exports.validateProduct = (req, res, next) => {
  const { name, quantity, slug } = req.body;
  if (!name || !slug || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  next();
};