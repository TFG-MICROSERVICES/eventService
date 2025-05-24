import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const Tournament = database.define(
    'Tournament',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'Events',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        elimination_type: {
            type: DataTypes.ENUM('single_elimination', 'double_elimination'),
            allowNull: false,
        },
        number_of_teams: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'Tournaments',
    }
);
