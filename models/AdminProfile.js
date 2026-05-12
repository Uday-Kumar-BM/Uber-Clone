import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AdminProfile = sequelize.define('AdminProfile', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    description: 'Array of permissions/roles',
  },
  lastLoginIp: {
    type: DataTypes.STRING,
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
  tableName: 'admin_profiles',
  timestamps: true,
});

export default AdminProfile;
