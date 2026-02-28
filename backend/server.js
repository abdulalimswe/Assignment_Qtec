require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./src/config/db');
const initDb = require('./src/config/initDb');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
