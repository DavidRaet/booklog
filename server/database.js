import dotenv from 'dotenv';
import sequelize from './config/database.js';

dotenv.config();

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: false });
        }
    } catch (error){
        console.log('Unable to connect to the database', error);
        process.exit(1);
    }
}



export default connectDB;