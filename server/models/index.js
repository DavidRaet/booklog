import sequelize from '../config/database.js';
import User from './User.js';
import Book from './Book.js';


const models = {
    User,
    Book, 
    sequelize
}; 

export default models; 
export { sequelize, User, Book };