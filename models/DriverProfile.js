import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DriverProfile = sequelize.define('DriverProfile', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  averageRating: {
    type: DataTypes.DECIMAL(2,1),
    allowNull: true,
    defaultValue: 0.0,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  currentLatitude: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: true,
  },
  currentLongitude: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: true,
  },
  driverStatus: {
    type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'inactive'),
    allowNull: false,
    defaultValue: 'pending_approval',
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
  tableName: 'driver_profiles',
  timestamps: true,
});

export default DriverProfile;
