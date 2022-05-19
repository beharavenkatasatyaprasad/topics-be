'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('topics', [
      { name: 'topica', label: 'Topic A' },
      { name: 'topicb', label: 'Topic B' },
      { name: 'topicc', label: 'Topic C' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
