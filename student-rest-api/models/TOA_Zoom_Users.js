

module.exports = function (sequelize, DataTypes) {
  var TOA_Zoom_Users = sequelize.define(
    "TOA_Zoom_Users",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      tutorId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      response:{
        type: DataTypes.TEXT,
        allowNull: false,
      },
      delete: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      update_ip: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "TOA_Zoom_Users",
    }
  );

  TOA_Zoom_Users.associate = function (model) {
    TOA_Zoom_Users.belongsTo(model.TOA_account, {
      foreignKey: "accountId",
      as: "account",
    }),
      TOA_Zoom_Users.belongsTo(model.TOA_tutor, {
        foreignKey: "tutorId",
        as: "tutor",
      });
  };

  return TOA_Zoom_Users;
};
