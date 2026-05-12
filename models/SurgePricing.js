import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SurgePricing = sequelize.define('SurgePricing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  areaIdentifier: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Downtown NYC, Airport',
  },
  latitude: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: false,
  },
  radiusKm: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false,
    defaultValue: 5.0,
  },
  multiplier: {
    type: DataTypes.DECIMAL(3,2),
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
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: 'surge_pricing',
  timestamps: true,
});

export default SurgePricing;
