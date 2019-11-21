/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_video = sequelize.define('TOA_video', {
    video_id: {
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
    video_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    video_stream_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "0: Aws , 1: YouTube , 2 : Vimeo"
    },
    video_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    video_duration:{
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    video_type: {
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
    video_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    video_preview: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    videoProcessingStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1,
      comment: "1 - Processing Video , 2 - Processing Successfuly completed , 3 - Failed to Process video"
    },
    videoHLSURL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoTransmissionId: {
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
    tableName: 'TOA_video'
  });

  TOA_video.associate = function(model){

    TOA_video.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'}),
    TOA_video.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id', as: 'subject'}),
    TOA_video.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id', as: 'topic'}), 
    TOA_video.belongsTo(model.TOA_content,  {foreignKey: 'content_id', as: 'content'}),
    TOA_video.belongsTo(model.TOA_paymentgateway,  {foreignKey: 'paymentgateway_id', as: 'payment_type'}),
    TOA_video.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
    TOA_video.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

    TOA_video.hasMany(model.TOA_student_purchase , { foreignKey: 'type' , as: 'payments'}),
    TOA_video.hasOne(model.TOA_video_log , { foreignKey: 'videoId' , as: 'videoProgress'})
  };

  return TOA_video;
};
