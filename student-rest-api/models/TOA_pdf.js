/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_pdf = sequelize.define('TOA_pdf', {
    pdf_id: {
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
    topic_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pdf_title: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    pdf_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pdf_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
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
    pdf_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pdf_preview: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    downloadable: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: "0 - No , 1 - Yes"
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
    tableName: 'TOA_pdf'
  });

  TOA_pdf.associate = function (model) {

    TOA_pdf.belongsTo(model.TOA_account, { foreignKey: 'account_id', as: 'account' }),
      TOA_pdf.belongsTo(model.TOA_subject, { foreignKey: 'subject_id', as: 'subject' }),
      TOA_pdf.belongsTo(model.TOA_topic, { foreignKey: 'topic_id', as: 'topic' }),
      TOA_pdf.belongsTo(model.TOA_content, { foreignKey: 'content_id', as: 'content' }),
      TOA_pdf.belongsTo(model.TOA_paymentgateway, { foreignKey: 'paymentgateway_id', as: 'payment_type' }),
      TOA_pdf.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
      TOA_pdf.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

      TOA_pdf.hasMany(model.TOA_student_purchase, { foreignKey: 'type', as: 'payments' }),
      TOA_pdf.hasOne(model.TOA_pdf_log, { foreignKey: 'pdfId', as: 'pdfProgress' })
  };

  return TOA_pdf;
};
