'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Movie',{
      image: {
        type: Sequelize.STRING,
      }
    });
  },
  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Movie');
     
  }
};
