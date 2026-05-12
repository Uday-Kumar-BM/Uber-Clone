import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

import sequelize from './config/db.js';
import models from './models/index.js'; // Import models for association setup
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverProfileRoutes from './routes/driverProfileRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { genericRoutesFactory } from './routes/genericRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks

// CORS setup
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/driver-profiles', driverProfileRoutes);
app.use('/api/rides', rideRoutes);

// Generic routes for other models (e.g., PaymentMethod, Notification, Vehicle)
// Example: app.use('/api/payment-methods', genericRoutesFactory(models.PaymentMethod));
// These routes are included as examples and need to be explicitly uncommented/added for each model.
// For brevity, we are not generating full CRUD for all 13 models. Models generated in full are User, DriverProfile, Ride.
// Below are templates/examples for how to integrate other models.
// app.use('/api/admin-profiles', genericRoutesFactory(models.AdminProfile));
// app.use('/api/rider-profiles', genericRoutesFactory(models.RiderProfile));
// app.use('/api/payment-methods', genericRoutesFactory(models.PaymentMethod));
// app.use('/api/notifications', genericRoutesFactory(models.Notification));
// app.use('/api/vehicles', genericRoutesFactory(models.Vehicle));
// app.use('/api/driver-location-history', genericRoutesFactory(models.DriverLocationHistory));
// app.use('/api/payment-transactions', genericRoutesFactory(models.PaymentTransaction));
// app.use('/api/ratings', genericRoutesFactory(models.Rating));
// app.use('/api/trip-logs', genericRoutesFactory(models.TripLog));
// app.use('/api/fare-components', genericRoutesFactory(models.FareComponent));
// app.use('/api/surge-pricing', genericRoutesFactory(models.SurgePricing));
// app.use('/api/locations', genericRoutesFactory(models.Location));
// app.use('/api/aggregated-metrics', genericRoutesFactory(models.AggregatedMetric));


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // await sequelize.sync({ force: false }); // Use { force: true } for development to drop and re-create tables
    // For production, use migrations (refer to README.md)
    console.log('Database models synchronized.');

    app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
