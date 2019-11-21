/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_plan_purchase = sequelize.define('TOA_plan_purchase', {
    plan_purchase_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    term_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_title: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    plan_sdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    plan_edate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    offer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    offer_code: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    plan_amount: {
      type: "DOUBLE",
      allowNull: false
    },
    currencyType: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    },
    plan_gst: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },

    gateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    offer_discount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },

    transaction_id: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'TOA_plan_purchase'
  });

  TOA_plan_purchase.associate = function (model) {

    TOA_plan_purchase.belongsTo(model.TOA_account, { foreignKey: 'account_id', as: 'account' }),
      TOA_plan_purchase.belongsTo(model.TOA_term, { foreignKey: 'term_id', as: 'term' }),
      TOA_plan_purchase.belongsTo(model.TOA_plan, { foreignKey: 'plan_id', as: 'plan' }),
      TOA_plan_purchase.belongsTo(model.TOA_admin_paymentgateway, { foreignKey: 'gateway_id' })
    TOA_plan_purchase.belongsTo(model.TOA_offer, { foreignKey: 'offer_id', as: 'appledOffer' })
    TOA_plan_purchase.belongsTo(model.TOA_currency, { foreignKey: 'currencyType', as: 'currency' })
  };

  return TOA_plan_purchase;
};
