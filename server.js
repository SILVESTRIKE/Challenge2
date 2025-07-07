const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const viewEngine = require('./config/viewengine');
const setupSwaggerDocs = require('./swaggerConfig'); // Import

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine
viewEngine(app);

// Routes
const apiRoutes = require('./routes/api_routes');     // API
const authViews = require('./routes/auth_views');       // WEB giao diện
app.use('/api/', apiRoutes);
app.use('/', authViews);

setupSwaggerDocs(app); // Gọi hàm để thiết lập route

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
