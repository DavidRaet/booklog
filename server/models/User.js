import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true, 
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true 
    }, 
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false, 
    },
},
        {
        tableName: 'users',
        schema: 'public',
        timestamps: false, 
        underscored: true,
        indexes: [
            {
                name: 'user_email_index',
                fields: ['email'],
                using: 'BTREE'
            }, 
            {
                name: 'username_index',
                fields: ['username'],
                using: 'BTREE'
            }
        ]
}); 

export default User;