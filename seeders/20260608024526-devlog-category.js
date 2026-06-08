'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('devlog_categories', [
      {
        name: 'Process',
        slug: 'process',
        description: 'Development Process',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Build Notes',
        slug: 'build-notes',
        description: 'Build Notes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Roadmap',
        slug: 'roadmap',
        description: 'Roadmap',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lore Drops',
        slug: 'lore-drops',
        description: 'Lore Drops',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Community',
        slug: 'community',
        description: 'Community',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Studio',
        slug: 'studio',
        description: 'Studio',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('devlog_categories', {
      name: {
        [Sequelize.Op.in]: ['Process', 'Build Notes', 'Roadmap', 'Lore Drops', 'Community', 'Studio']
      }
    }, {});
  }
};
