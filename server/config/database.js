import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '../server/.env.local'});

/**
 * Custom SQL logger for Sequelize
 * In development, logs SQL queries for debugging
 * In production/test, logging is disabled for performance
 */
const sqlLogger = process.env.NODE_ENV === 'development' 
    ? (sql) => console.log(`[SQL] ${sql}`) 
    : false;

const sequelize = new Sequelize(
    process.env.POSTGRES_URL,
    {
        dialect: 'postgres',
        logging: sqlLogger, 
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;