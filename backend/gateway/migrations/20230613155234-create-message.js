'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.BLOB
      },
      from_user_id: {
        type: Sequelize.INTEGER
      },
      to_user_id: {
        type: Sequelize.INTEGER
      },
      to_number: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending','process','sent','delivered','failed','un-deliverable','expired','rejected','invalid','unknown','buffered','deleted')
      },
      create_by: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};