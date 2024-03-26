const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

class File extends Model {}

File.init(
  {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privateKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "File",
  }
);

module.exports = File;
