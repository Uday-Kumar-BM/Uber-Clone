import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FareComponent = sequelize.define('FareComponent', {
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
  componentType: {
    type: DataTypes.ENUM('base_fare', 'distance_fare', 'time_fare', 'surge_fare', 'tax', 'tip', 'discount', 'other'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
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
  tableName: 'fare_components',
  timestamps: true,
});

export default FareComponent;
