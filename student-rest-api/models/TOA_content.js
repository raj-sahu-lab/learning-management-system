/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_content = sequelize.define('TOA_content', {
    content_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    topic_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    content_description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    content_type: {
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
    content_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    content_preview: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    content_test: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content_practice: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'TOA_content'
  });

  TOA_content.associate = function (model) {

    TOA_content.belongsTo(model.TOA_account, { foreignKey: 'account_id', as: 'account'}),
      TOA_content.belongsTo(model.TOA_subject, { foreignKey: 'subject_id', as: 'subject' }),
      TOA_content.belongsTo(model.TOA_topic, { foreignKey: 'topic_id', as: 'topic' }),
      TOA_content.belongsTo(model.TOA_paymentgateway, { foreignKey: 'paymentgateway_id', as: 'payment_type' }),
      TOA_content.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
      TOA_content.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

      TOA_content.hasMany(model.TOA_pdf, { foreignKey: 'content_id', as: 'pdf' }),
      TOA_content.hasMany(model.TOA_ppt, { foreignKey: 'content_id', as: 'ppt' }),
      TOA_content.hasMany(model.TOA_audio, { foreignKey: 'content_id', as: 'audio' }),
      TOA_content.hasMany(model.TOA_video, { foreignKey: 'content_id', as: 'video' }),

      TOA_content.hasMany(model.TOA_test, { foreignKey: 'content_id', as: 'tests' }),
      TOA_content.hasMany(model.TOA_practice, { foreignKey: 'content_id', as: 'practice' }),


      TOA_content.hasMany(model.TOA_student_purchase , { foreignKey: 'type' , as: 'payments'})
  };

  return TOA_content;
};
