/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_gateway_type = sequelize.define('TOA_gateway_type', {
  
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      delete: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
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
      tableName: 'TOA_gateway_type'
    });
  
    return TOA_gateway_type;
  };
  