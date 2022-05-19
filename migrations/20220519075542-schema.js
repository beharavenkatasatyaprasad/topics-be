'use strict';
const fs = require('fs');
module.exports = {
  async up(queryInterface, Sequelize) {
    var sql_string = fs.readFileSync('schema.sql', 'utf8');
    const sequelize = new Sequelize('StudentsMatchingWithDissertationTopicsSystem', 'root', '4456', {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
      },
    });

    await sequelize.query(sql_string);
  },

  async down(queryInterface, Sequelize) {
  },
};
