/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_admin_paymentgateway = sequelize.define('TOA_admin_paymentgateway', {

    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gateway_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    gateway_value: {
      type: DataTypes.TEXT,
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
    tableName: 'TOA_admin_paymentgateway'
  });

  TOA_admin_paymentgateway.associate = function(model){

    TOA_admin_paymentgateway.belongsTo(model.TOA_gateway_type,  {foreignKey: 'gateway_type',as: 'paymentGateWay'})
  };

  return TOA_admin_paymentgateway;
};
