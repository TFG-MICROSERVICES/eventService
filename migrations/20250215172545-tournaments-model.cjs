'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tournaments', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            elimination_type: {
                type: Sequelize.ENUM('single_elimination', 'double_elimination'),
                allowNull: false,
            },
            number_of_teams: {
                type: Sequelize.INTEGER,
                allowNull: false,
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

        await queryInterface.addIndex('Tournaments', ['event_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Tournaments');
    },
};
