'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tester_applications', 'build_platform', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'MacOS'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tester_applications', 'build_platform');
  }
};
