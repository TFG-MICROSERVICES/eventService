import { DataTypes } from 'sequelize';

export const Tournament = (sequelize) => {
    const Tournament = sequelize.define('Tournament', {
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
        elimination_type: {
            type: DataTypes.ENUM('single_elimination', 'double_elimination', 'group_stage'),
            allowNull: false,
        },
        team_for_group: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        number_of_teams: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Tournament.associate = (models) => {
        Tournament.belongsTo(models.Event, {
            foreignKey: 'event_id',
            targetKey: 'event_id',
            onDelete: 'CASCADE',
        });
    };

    return Tournament;
};
