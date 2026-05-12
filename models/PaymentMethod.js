import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('card', 'wallet', 'bank_account'),
    allowNull: false,
  },
  last4Digits: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Encrypted payment token or wallet ID',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expirationDate: {
    type: DataTypes.STRING(7),
    allowNull: true,
    comment: 'MM/YYYY format'
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
  tableName: 'payment_methods',
  timestamps: true,
});

export default PaymentMethod;
