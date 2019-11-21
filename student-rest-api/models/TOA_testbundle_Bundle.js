/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Bundle = sequelize.define('TOA_testbundle_Bundle', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      accountId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isPaid: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      currencyId:{
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 1
      },
      paymentGateWayId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      iosPaymentGateWayid: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      validity: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      preview: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isPublished: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
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
      tableName: 'TOA_testbundle_Bundle'
    });
  
    TOA_testbundle_Bundle.associate = function(model){
      
      TOA_testbundle_Bundle.belongsTo(model.TOA_paymentgateway,  {foreignKey: 'paymentGateWayId', as: 'payment_type'}),
      TOA_testbundle_Bundle.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
      TOA_testbundle_Bundle.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account' , onDelete: 'cascade'}),
      TOA_testbundle_Bundle.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

      TOA_testbundle_Bundle.hasMany(model.TOA_testbundle_Bundle_Set,  {foreignKey: 'bundleId', as: 'setList'})
      
    };
  
    return TOA_testbundle_Bundle;
  };
  