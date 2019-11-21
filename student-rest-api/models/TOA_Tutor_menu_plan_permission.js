module.exports = function (sequelize, DataTypes) {
  var TOA_Tutor_menu_plan_permission = sequelize.define('TOA_Tutor_menu_plan_permission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    plan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    menuPermissions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    subMenuPermissions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    update_ip: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'TOA_Tutor_menu_plan_permission'
  });

  TOA_Tutor_menu_plan_permission.associate = function (model) {

    TOA_Tutor_menu_plan_permission.belongsTo(model.TOA_plan, { foreignKey: 'plan_id' , as: 'plan' })

  };
  return TOA_Tutor_menu_plan_permission;
};
