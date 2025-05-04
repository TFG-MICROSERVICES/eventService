import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const Result = database.define(
    'Result',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Events',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        home_team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        away_team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score_home: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score_away: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        round: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        playedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        indexes: [
            { fields: ['event_id'] },
            { fields: ['home_team_id'] },
            { fields: ['away_team_id'] },
        ],
        tableName: 'Results',
    }
);

// Asociaciones (ajusta según tus modelos)
Result.associate = (models) => {
    Result.belongsTo(models.Event, {
        foreignKey: 'event_id',
        onDelete: 'CASCADE',
    });
};
