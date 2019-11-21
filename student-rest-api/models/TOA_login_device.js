module.exports = function(sequelize, DataTypes) {

    var TOA_login_device = sequelize.define('TOA_login_device', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }, 
      type: {
        // for super admin - admin
        // for institutte - institute
        // for tutor - tutor
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      typeId: {
        // admin_id for super admin
        // account_id for institute and tutor
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      userId: {
        // id of admin for super admin
        // id of account for institute
        // id of tutor for tutor
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      webDeviceId: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: true,
        default : null
      },
    }, {
      tableName: 'TOA_login_device'
    });
  
    return TOA_login_device;
  };
  