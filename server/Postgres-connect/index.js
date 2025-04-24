import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);
sequelize.sync({ alter: true }) // `alter` = safe update, `force` = drop & recreate
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Sync failed:", err));
export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

