import { DataTypes } = require('sequelize');
import sequelize from '../config/db.js';

const PaymentTransaction = sequelize.define('PaymentTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rideId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One payment transaction per ride
    references: {
      model: 'rides',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'cash', 'wallet'),
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'ID from payment gateway provider',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
  transactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
  tableName: 'payment_transactions',
  timestamps: true,
});

export default PaymentTransaction;
