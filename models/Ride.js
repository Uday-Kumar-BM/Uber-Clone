import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  riderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  driverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id',
    },
  },
  originLat: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: false,
  },
  originLong: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: false,
  },
  destinationLat: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: false,
  },
  destinationLong: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: false,
  },
  pickupAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dropoffAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fareAmount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: true,
    defaultValue: 'USD',
  },
  distanceKm: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'en_route', 'arrived', 'started', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  surgeMultiplierApplied: {
    type: DataTypes.DECIMAL(3,2),
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'rides',
  timestamps: true,
});

export default Ride;
