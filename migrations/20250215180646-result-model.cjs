'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'Results',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                },
                event_id: {
                    type: Sequelize.INTEGER,
                    unique: true,
                    allowNull: false,
                    references: {
                        model: 'Events',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                home_team_id: {
                    type: Sequelize.STRING,
                    max: 255,
                    allowNull: false,
                },
                away_team_id: {
                    type: Sequelize.STRING,
                    max: 255,
                    allowNull: false,
                },
                score_home: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                score_away: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                primaryKey: ['event_id', 'home_team_id', 'away_team_id'],
            }
        );

        await queryInterface.addIndex('Results', ['event_id']);
        await queryInterface.addIndex('Results', ['home_team_id']);
        await queryInterface.addIndex('Results', ['away_team_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Results');
    },
};
