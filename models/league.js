import { DataTypes } from 'sequelize';

export const League = (sequelize) => {
    const League = sequelize.define('League', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        number_of_teams: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    });

    League.associate = (models) => {
        League.belongsTo(models.Event, {
            foreignKey: 'event_id',
            targetKey: 'event_id',
            onDelete: 'CASCADE',
        });
    };

    return League;
};
