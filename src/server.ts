import express from 'express';
import { sequelize } from './config/db.js';
import cookieParser from 'cookie-parser';
import './models/index.js';
import authRoutes from './routers/auth.js';
import roomRoutes from './routers/room.js';
import bookingRoutes from './routers/booking.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

startServer();