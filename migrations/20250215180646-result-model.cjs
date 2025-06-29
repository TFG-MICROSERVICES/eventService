'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Results', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            event_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Events',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            home_team_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            away_team_id: {
                type: Sequelize.INTEGER,
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
            round: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            playedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('Results', ['event_id']);
        await queryInterface.addIndex('Results', ['home_team_id']);
        await queryInterface.addIndex('Results', ['away_team_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Results');
    },
};
