'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Leagues', {
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
            teams_max: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            round_robin: {
                //Si hay ida y vuelta, o solo ida
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        await queryInterface.addIndex('Leagues', ['event_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Leagues');
    },
};
