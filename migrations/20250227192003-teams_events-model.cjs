'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TeamsEvents', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            team_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
                primaryKey: true,
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
        });

        await queryInterface.addIndex('TeamsEvents', ['event_id']);
        await queryInterface.addIndex('TeamsEvents', ['team_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TeamsEvents');
    },
};
