var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _topics = require("./topics");
var _userPreferences = require("./userPreferences");
var _userTypes = require("./userTypes");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var topics = _topics(sequelize, DataTypes);
  var userPreferences = _userPreferences(sequelize, DataTypes);
  var userTypes = _userTypes(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  userPreferences.belongsTo(topics, { as: "preference", foreignKey: "preferenceId"});
  topics.hasMany(userPreferences, { as: "userpreferences", foreignKey: "preferenceId"});
  users.belongsTo(userTypes, { as: "userType", foreignKey: "userTypeId"});
  userTypes.hasMany(users, { as: "users", foreignKey: "userTypeId"});
  userPreferences.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(userPreferences, { as: "userpreferences", foreignKey: "userId"});

  return {
    SequelizeMeta,
    topics,
    userPreferences,
    userTypes,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
