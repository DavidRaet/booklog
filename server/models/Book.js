import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false 
    }, 
    title: {
        type: DataTypes.STRING(255),
        allowNull: false 
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false 
    },
    genre: {
        type: DataTypes.STRING(50),
        allowNull: false 
    },
    rating: {
        type: DataTypes.DOUBLE,
        allowNull: false 
    }, 
    review: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW()
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW()
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'books',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            name: 'username_books_index',
            fields: ['user_id'],
            using: 'BTREE'
        }
    ]
});

Book.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
User.hasMany(Book, { foreignKey: 'user_id', as: 'books' });

export default Book; 