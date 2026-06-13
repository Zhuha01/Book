import express from 'express';
import { sequelize } from './config/db.js';
import './models/index.js';
import authRoutes from './routers/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Successful connection to the PostgreSQL database!');

    await sequelize.sync({ alter: true });
    console.log('✅ Models successfully synchronized with the database. Tables created!');

    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

startServer();