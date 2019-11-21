/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_paymentgateway = sequelize.define('TOA_paymentgateway', {
    paymentgateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    paymentgateway_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    paymentgateway_authkey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    paymentgateway_authsecret: {
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
    tableName: 'TOA_paymentgateway',
    associate: function(models){

      TOA_paymentgateway.belongsTo(models.TOA_subject);
    }
  });

  TOA_paymentgateway.associate = function(model){

    TOA_paymentgateway.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };

  return TOA_paymentgateway;
};
