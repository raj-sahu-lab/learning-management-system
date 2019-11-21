/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_audio = sequelize.define('TOA_audio', {
    audio_id: {
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
    audio_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    audio_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    audio_duration:{
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    audio_type: {
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
    audio_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    audio_preview: {
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
    tableName: 'TOA_audio',
    
  });

  TOA_audio.associate = function(model){

    TOA_audio.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'}),
    TOA_audio.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id', as: 'subject'}),
    TOA_audio.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id', as: 'topic'}), 
    TOA_audio.belongsTo(model.TOA_content,  {foreignKey: 'content_id', as: 'content'}),
    TOA_audio.belongsTo(model.TOA_paymentgateway,  {foreignKey: 'paymentgateway_id', as: 'payment_type'}),
    TOA_audio.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
    TOA_audio.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

    TOA_audio.hasMany(model.TOA_student_purchase , { foreignKey: 'type' , as: 'payments'}),
    TOA_audio.hasOne(model.TOA_audio_log , { foreignKey: 'audioId' , as: 'audioProgress'})
  };

  return TOA_audio;
};
