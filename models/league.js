import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const League = database.define(
    'League',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'Events',
                key: 'id',
            },
        },
        teams_max: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        round_robin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'Leagues',
    }
);
