'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('admin123', 10);
    const hashedPassword2 = await bcrypt.hash('user123', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@hiplanet.com',
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        email: 'user1@hiplanet.com',
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      username: {
        [Sequelize.Op.in]: ['admin', 'user1']
      }
    }, {});
  }
};
