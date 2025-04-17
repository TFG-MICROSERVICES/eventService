import { DataTypes } from 'sequelize';
import database from '../db/database.js';

export const Result = (sequelize) => {
    const Result = database.define(
        'Result',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            home_team_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
            },
            away_team_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true,
            },
            score_home: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            score_away: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            indexes: [{ fields: ['event_id'] }, { fields: ['home_team_id'] }, { fields: ['away_team_id'] }],
        }
    );

    Result.associate = (models) => {
        Result.belongsTo(models.Event, {
            foreignKey: 'event_id',
            targetKey: 'event_id',
            onDelete: 'CASCADE',
        });
    };

    return Result;
};
