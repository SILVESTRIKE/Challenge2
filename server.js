require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product_routes');

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT, () => {
    console.log(` Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.log(' DB Connection Error:', err));
