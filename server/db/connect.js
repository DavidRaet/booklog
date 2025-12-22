import dotenv from 'dotenv';
import sequelize from '../config/database.js';

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
        console.log('Database connection successful!');
        if (process.env.local.NODE_ENV === 'development') {
            await sequelize.sync({ alter: false });
        }
    } catch (error){
        console.log('Unable to connect to the database', error);
        process.exit(1);
    }
};



export default connectDB;