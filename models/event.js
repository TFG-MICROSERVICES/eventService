import { DataTypes } from 'sequelize';

export const Event = (sequelize) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        event_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        sport_id: {
            type: DataTypes.STRING,
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
    });

    return Event;
};
