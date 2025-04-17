import { DataTypes } from 'sequelize';
import database from '../db/database.js';
import { Tournament } from './tournament.js';
import { League } from './league.js';
import { Result } from './result.js';

export const Event = database.define(
    'Event',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sport_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        event_type: {
            type: DataTypes.ENUM('single', 'tournament', 'league'),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('0', '1', '2'),
            allowNull: false,
            defaultValue: '1',
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        registration_start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        registration_end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'Events',
    }
);

// // Definir las relaciones
// Event.hasOne(Tournament, { foreignKey: 'event_id', sourceKey: 'event_id' });
// Tournament.belongsTo(Event, { foreignKey: 'event_id', targetKey: 'event_id' });

// Event.hasOne(League, { foreignKey: 'event_id', sourceKey: 'event_id' });
// League.belongsTo(Event, { foreignKey: 'event_id', targetKey: 'event_id' });

// Event.hasMany(Result, { foreignKey: 'event_id', sourceKey: 'event_id' });
// Result.belongsTo(Event, { foreignKey: 'event_id', targetKey: 'event_id' });
