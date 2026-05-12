import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const RiderProfile = sequelize.define('RiderProfile', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  defaultPaymentMethodId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'payment_methods',
      key: 'id',
    },
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
  tableName: 'rider_profiles',
  timestamps: true,
});

export default RiderProfile;
