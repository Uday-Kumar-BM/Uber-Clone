import sequelize from '../config/db.js';
import User from './User.js';
import AdminProfile from './AdminProfile.js';
import DriverLocationHistory from './DriverLocationHistory.js';
import DriverProfile from './DriverProfile.js';
import FareComponent from './FareComponent.js';
import Location from './Location.js';
import Notification from './Notification.js';
import PaymentMethod from './PaymentMethod.js';
import PaymentTransaction from './PaymentTransaction.js';
import Rating from './Rating.js';
import RiderProfile from './RiderProfile.js';
import Ride from './Ride.js';
import SurgePricing from './SurgePricing.js';
import SupportTicket from './SupportTicket.js';
import Vehicle from './Vehicle.js';
import AggregatedMetric from './AggregatedMetric.js';

// Define Associations

// User Associations
User.hasOne(AdminProfile, { foreignKey: 'userId', as: 'adminProfile', onDelete: 'CASCADE' });
AdminProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(DriverProfile, { foreignKey: 'userId', as: 'driverProfile', onDelete: 'CASCADE' });
DriverProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(RiderProfile, { foreignKey: 'userId', as: 'riderProfile', onDelete: 'CASCADE' });
RiderProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PaymentMethod, { foreignKey: 'userId', as: 'paymentMethods', onDelete: 'CASCADE' });
PaymentMethod.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Vehicle, { foreignKey: 'driverId', as: 'vehicles', onDelete: 'CASCADE' });
Vehicle.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(DriverLocationHistory, { foreignKey: 'driverId', as: 'locationHistory', onDelete: 'CASCADE' });
DriverLocationHistory.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

User.hasMany(PaymentTransaction, { foreignKey: 'userId', as: 'paymentTransactions', onDelete: 'RESTRICT' });
PaymentTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SupportTicket, { foreignKey: 'raiserUserId', as: 'raisedTickets', onDelete: 'CASCADE' });
SupportTicket.belongsTo(User, { foreignKey: 'raiserUserId', as: 'raiserUser' });

User.hasMany(SupportTicket, { foreignKey: 'assignedToAdminId', as: 'assignedTickets', onDelete: 'SET NULL' });
SupportTicket.belongsTo(User, { foreignKey: 'assignedToAdminId', as: 'assignedToAdmin' });

User.hasMany(Rating, { foreignKey: 'raterUserId', as: 'ratingsGiven', onDelete: 'CASCADE' });
User.hasMany(Rating, { foreignKey: 'rateeUserId', as: 'ratingsReceived', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'raterUserId', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'rateeUserId', as: 'ratee' });

User.hasMany(Location, { foreignKey: 'userId', as: 'savedLocations', onDelete: 'CASCADE' });
Location.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Ride Associations
Ride.belongsTo(User, { as: 'rider', foreignKey: 'riderId' });
Ride.belongsTo(User, { as: 'driver', foreignKey: 'driverId' });
Ride.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

Ride.hasOne(PaymentTransaction, { foreignKey: 'rideId', as: 'paymentTransaction', onDelete: 'CASCADE' });
PaymentTransaction.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

Ride.hasOne(Rating, { foreignKey: 'rideId', as: 'rating', onDelete: 'CASCADE' });
Rating.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

Ride.hasMany(TripLog, { foreignKey: 'rideId', as: 'tripLogs', onDelete: 'CASCADE' });
TripLog.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

Ride.hasMany(FareComponent, { foreignKey: 'rideId', as: 'fareComponents', onDelete: 'CASCADE' });
FareComponent.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

Ride.hasMany(SupportTicket, { foreignKey: 'rideId', as: 'supportTickets', onDelete: 'SET NULL' });
SupportTicket.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

// RiderProfile and PaymentMethod (Default Payment Method)
RiderProfile.belongsTo(PaymentMethod, { foreignKey: 'defaultPaymentMethodId', as: 'defaultPaymentMethod' });
PaymentMethod.hasMany(RiderProfile, { foreignKey: 'defaultPaymentMethodId', as: 'defaultForRiders' });

// Export all models
const models = {
  User,
  AdminProfile,
  DriverLocationHistory,
  DriverProfile,
  FareComponent,
  Location,
  Notification,
  PaymentMethod,
  PaymentTransaction,
  Rating,
  RiderProfile,
  Ride,
  SurgePricing,
  SupportTicket,
  Vehicle,
  AggregatedMetric
};

export default models;
