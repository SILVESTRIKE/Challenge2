const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const viewEngine = require('./config/viewengine');
const setupSwaggerDocs = require('./swaggerConfig');
const methodOverride = require('method-override');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

viewEngine(app);

const apiRoutes = require('./routes/api_routes');
const webRoutes = require('./routes/web_routes');

app.use('/api', apiRoutes);

app.use('/', webRoutes);

setupSwaggerDocs(app);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
  } catch (err) {
    console.error('Không thể khởi động server:', err);
  }
};

startServer();