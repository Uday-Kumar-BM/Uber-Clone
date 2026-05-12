import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbType = process.env.DB_TYPE || 'postgres';
const dbUri = process.env.DATABASE_URI; // Use a single URI for simplicity

if (!dbUri) {
  console.error('DATABASE_URI environment variable is not set.');
  process.exit(1);
}

const sequelize = new Sequelize(dbUri, {
  dialect: dbType,
  logging: false, // Set to true to see SQL queries in console
  dialectOptions: {
    // SSL is often required for production databases like Heroku Postgres
    // Uncomment and configure if your database requires SSL
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false // This will bypass SSL certificate verification. Use with caution.
    // }
  }
});

export default sequelize;
