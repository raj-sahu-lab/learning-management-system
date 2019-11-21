/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_plan_payment =  sequelize.define('TOA_plan_payment', {
    plan_payment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_purchase_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    gateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_payment_response: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'TOA_plan_payment'
  });

  TOA_plan_payment.associate = function(model){

    TOA_plan_payment.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_plan_payment.belongsTo(model.TOA_plan_purchase,  {foreignKey: 'plan_purchase_id'}),
    TOA_plan_payment.belongsTo(model.TOA_admin_paymentgateway,  {foreignKey: '	gateway_id'})
  };

  return TOA_plan_payment;
};
