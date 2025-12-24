import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import logger from '../utils/logger.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Database Connection Module 
 * This module establishes a connection to the database using Sequelize ORM.
 * It handles the connection logic and ensures that the application can interact with the database.
 */
const connectDB = async () => {
    try {
        // Test the database connection
        await sequelize.authenticate();
        logger.info('Database connection successful');
        if (process.env.NODE_ENV === 'development') {            
            await sequelize.sync({ alter: false });
        }
    } catch (error){
        logger.error('Unable to connect to the database', { error: error.message });
        process.exit(1);
    }
};



export default connectDB;