/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_topic = sequelize.define('TOA_topic', {
    topic_id: {
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
    subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    topic_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    topic_description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    topic_type: {
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
    topic_amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    topic_preview: {
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
    tableName: 'TOA_topic'
  });

  TOA_topic.associate = function (model) {

      TOA_topic.belongsTo(model.TOA_account, { foreignKey: 'account_id' , as: 'account' }),
      TOA_topic.belongsTo(model.TOA_subject, { foreignKey: 'subject_id', as: 'subject' }),
      TOA_topic.belongsTo(model.TOA_paymentgateway, { foreignKey: 'paymentgateway_id', as: 'payment_type' }),
      TOA_topic.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
      TOA_topic.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

      // Many Relationship
      TOA_topic.hasMany(model.TOA_content, { foreignKey: 'topic_id', as: 'contents' }),

      // Files Relationship
      TOA_topic.hasMany(model.TOA_pdf, { foreignKey: 'topic_id', as: 'pdf' }),
      TOA_topic.hasMany(model.TOA_ppt, { foreignKey: 'topic_id', as: 'ppt' }),
      TOA_topic.hasMany(model.TOA_audio, { foreignKey: 'topic_id', as: 'audio' }),
      TOA_topic.hasMany(model.TOA_video, { foreignKey: 'topic_id', as: 'video' }),

      TOA_topic.hasMany(model.TOA_student_purchase , { foreignKey: 'type' , as: 'payments'})

  };


  return TOA_topic;
};
