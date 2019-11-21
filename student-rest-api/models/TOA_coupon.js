/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_coupon = sequelize.define('TOA_coupon', {
    coupon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "1- Subject , 2 - Topic , 3 - Content , 4 - Test , 5 - Practice , 6 - PDF , 7 - PPT , 8 - Audio , 9 - Video , 10 - Test Bundle"
    },
    type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_title: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    coupon_code: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    coupon_user: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coupon_discount: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    currencyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    },
    coupon_min_buy_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    coupon_max_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    coupon_sdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    coupon_edate: {
      type: DataTypes.DATEONLY,
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
    tableName: 'TOA_coupon'
  });

  TOA_coupon.associate = function (model) {

    TOA_coupon.belongsTo(model.TOA_account, { foreignKey: 'account_id' }),
      TOA_coupon.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' })
  };


  return TOA_coupon;
};
