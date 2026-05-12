import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AggregatedMetric = sequelize.define('AggregatedMetric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  metricName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(18,2),
    allowNull: false,
  },
  dataType: {
    type: DataTypes.ENUM('count', 'sum', 'average', 'max', 'min'),
    allowNull: false,
  },
  period: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'hourly'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Start of the period for the metric',
  },
  metaData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional context like geo-area, user-type etc.',
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
  tableName: 'aggregated_metrics',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['metricName', 'period', 'timestamp', 'dataType'],
    },
    { fields: ['metricName', 'timestamp'] }
  ],
});

export default AggregatedMetric;
