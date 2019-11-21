/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Offer = sequelize.define('TOA_offer', {
    offer_id: {
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
    offer_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    offer_code: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    offer_user: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    offer_discount: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    offer_max_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    maxDollerAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    offer_sdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    offer_edate: {
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
    tableName: 'TOA_offer'
  });

  Offer.associate = function(model){

    Offer.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    Offer.belongsTo(model.TOA_term,  {foreignKey: 'term_id',as: 'term'})
  };

  Offer.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Offer
};
