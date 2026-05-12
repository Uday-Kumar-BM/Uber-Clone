import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rideId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One rating per ride (from one side, e.g., rider to driver)
    references: {
      model: 'rides',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  raterUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  rateeUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  ratingValue: {
    type: DataTypes.DECIMAL(2,1),
    allowNull: false,
    validate: {
      min: 1.0,
      max: 5.0,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'ratings',
  timestamps: true,
});

export default Rating;
