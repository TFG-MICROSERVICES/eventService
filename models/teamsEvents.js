'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TeamsEvents extends Model {
        static associate(models) {
            TeamsEvents.belongsTo(models.Event, {
                foreignKey: 'event_id',
                targetKey: 'id',
                onDelete: 'CASCADE',
            });
        }
    }

    TeamsEvents.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            team_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            event_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Events',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'TeamsEvents',
            timestamps: false,
            indexes: [{ fields: ['event_id'] }],
        }
    );

    return TeamsEvents;
};
