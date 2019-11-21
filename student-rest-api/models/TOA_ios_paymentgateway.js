/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_ios_paymentgateway = sequelize.define('TOA_ios_paymentgateway', {
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
      inAppId: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      inAppamount: {
        type: DataTypes.FLOAT,
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
      tableName: 'TOA_ios_paymentgateway',
    });

    return TOA_ios_paymentgateway;
  };
  