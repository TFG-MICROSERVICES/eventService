"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Leagues", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      event_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Events",
          key: "event_id",
        },
        onDelete: "CASCADE",
      },
      teams_min: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      teams_max: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Leagues");
  },
};
