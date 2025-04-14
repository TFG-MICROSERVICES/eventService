'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Events', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            event_id: {
                type: Sequelize.STRING,
                max: 255,
                primaryKey: true,
            },
            sport_id: {
                type: Sequelize.STRING,
                max: 255,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                max: 255,
                unique: true,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            event_type: {
                type: Sequelize.ENUM('single', 'tournament', 'league'),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('0', '1', '2'),
                allowNull: false,
                defaultValue: '1',
            },
            location: {
                type: Sequelize.STRING,
                max: 255,
                allowNull: false,
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            end_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            registration_start: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            registration_end: {
                type: Sequelize.DATE,
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

        //Agregamos indices para mejorar rendimiento de busquedas
        await queryInterface.addIndex('Events', ['sport_id']);
        await queryInterface.addIndex('Events', ['event_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Events');
    },
};
