import { Sequelize } from "sequelize";
import dotenv from 'dotenv';


dotenv.config({path: '../server/.env.local'});


const sequelize = new Sequelize(
    process.env.POSTGRES_URL,
    {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false, 
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;