import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vehicle = sequelize.define('Vehicle', {
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
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleType: {
    type: DataTypes.ENUM('sedan', 'SUV', 'van', 'bike', 'luxury'),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  insuranceDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object for insurance policy number, expiry, etc.',
  },
  registrationDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object for registration number, expiry, etc.',
  },
  status: {
    type: DataTypes.ENUM('active', 'in_service', 'maintenance', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
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
  tableName: 'vehicles',
  timestamps: true,
});

export default Vehicle;
