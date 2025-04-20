import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const TeamEvent = database.define(
    'UserEvent',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Events',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
    },
    {
        tableName: 'TeamsEvents',
    }
);
