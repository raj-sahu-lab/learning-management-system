/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_subject = sequelize.define('TOA_subject', {
    subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    branch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tutor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    subject_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    subject_description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    subject_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    subject_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    validity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    currencyId:{
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    },
    paymentgateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    iosPaymentGateWayid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    subject_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    subject_preview: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
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
    tableName: 'TOA_subject',
  });

  TOA_subject.associate = function (model) {

    TOA_subject.belongsTo(model.TOA_account, { foreignKey: 'account_id', as: 'account' }),
      TOA_subject.belongsTo(model.TOA_paymentgateway, { foreignKey: 'paymentgateway_id', as: 'payment_type' }),
      TOA_subject.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
      TOA_subject.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),
      TOA_subject.belongsTo(model.TOA_tutor, { foreignKey: 'tutor_id', as: 'tutor' }),

      TOA_subject.hasMany(model.TOA_topic, { foreignKey: 'subject_id', as: 'topics' }),
      TOA_subject.hasMany(model.TOA_student_purchase , { foreignKey: 'typeId' , as: 'payments'}),
      TOA_subject.hasMany(model.TOA_review , { foreignKey: 'typeId' , as: 'reviews'})
  };

  return TOA_subject;
};
