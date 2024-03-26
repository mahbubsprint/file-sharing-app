const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../connection");

class RequestLimit extends Model {}

// Initialize the RequestLimit model
RequestLimit.init(
  {
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    daily_upload: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    daily_download: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "RequestLimit",
  }
);

module.exports = RequestLimit;
