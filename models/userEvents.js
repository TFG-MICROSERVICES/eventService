import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const UserEvent = database.define(
    'UserEvent',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Events',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        tableName: 'UsersEvents',
    }
);
