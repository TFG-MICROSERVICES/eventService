'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.createTable('TeamsEvents', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            team_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            event_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Events',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
            primaryKey: ['team_id', 'event_id'],
        });

        await queryInterface.addIndex('TeamsEvents', ['event_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TeamsEvents');
    },
};
