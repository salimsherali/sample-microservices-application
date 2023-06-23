'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Message.init({
    message: DataTypes.BLOB,
    from_user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    to_number: DataTypes.STRING,
    status: DataTypes.ENUM('pending','process','sent','delivered','failed','un-deliverable','expired','rejected','invalid','unknown','buffered','deleted'),
    create_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};