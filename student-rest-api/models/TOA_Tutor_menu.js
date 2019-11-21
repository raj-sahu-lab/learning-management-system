module.exports = function (sequelize, DataTypes) {
    var TOA_Tutor_menu = sequelize.define('TOA_Tutor_menu', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: true
      },
      nav_link: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 1
      },
      delete: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
      }
    }, {
      tableName: 'TOA_Tutor_menu'
    });

    TOA_Tutor_menu.associate = function (model) {

      TOA_Tutor_menu.hasMany(model.TOA_Tutor_sub_menu, { foreignKey: 'menu_id' , as: 'subMenu' })
  
    };
    return TOA_Tutor_menu;
  };
  