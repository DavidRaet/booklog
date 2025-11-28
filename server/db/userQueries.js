import pool from "../database.js";
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const SALT_ROUNDS = 10;

export const createUser = async (username, email, password) => {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        username, 
        email, 
        password_hash
    });

    return user;
};


export const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: { email }
    })

    return user;
};


export const getUserById = async (id) => {
    const user = await User.findByPk(id);

    return user;
};

export const confirmPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};