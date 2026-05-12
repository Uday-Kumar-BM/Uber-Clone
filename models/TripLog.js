import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TripLog = sequelize.define('TripLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rideId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rides',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  eventType: {
    type: DataTypes.ENUM('request', 'accepted', 'pickup', 'dropoff', 'cancel', 'driver_arrived', 'route_update'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object for extra event details (e.g., new coordinates for route_update)',
  },
}, {
  tableName: 'trip_logs',
  timestamps: false, // Using custom 'timestamp' field
  indexes: [
    { fields: ['rideId', 'timestamp'] } // Helps query by ride events in order
  ],
});

export default TripLog;
