"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Leagues", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        references: {
          model: "Events",
          key: "event_id",
        },
        onDelete: "CASCADE",
      },
      number_of_teams: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Leagues");
  },
};
