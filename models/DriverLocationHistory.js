import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DriverLocationHistory = sequelize.define('DriverLocationHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  driverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  latitude: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'driver_location_history',
  timestamps: false, // We use 'timestamp' field instead of default createdAt/updatedAt
});

export default DriverLocationHistory;
