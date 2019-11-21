/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

  var TOA_test = sequelize.define('TOA_test', {
    test_id: {
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
    test_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    test_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    test_preview: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_timed: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_duration: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    test_total_mark: {
      type: DataTypes.FLOAT,
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
    tableName: 'TOA_test'
  });

  TOA_test.associate = function(model){

    TOA_test.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'}),
    TOA_test.belongsTo(model.TOA_branch,  {foreignKey: 'branch_id' , as: 'branch'}),
    TOA_test.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id', as: 'subject'}),
    TOA_test.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id', as: 'topic'}), 
    TOA_test.belongsTo(model.TOA_content,  {foreignKey: 'content_id', as: 'content'}),
    TOA_test.belongsTo(model.TOA_paymentgateway,  {foreignKey: 'paymentgateway_id', as: 'payment_type'}),
    TOA_test.belongsTo(model.TOA_ios_paymentgateway, { foreignKey: 'iosPaymentGateWayid', as: 'iosPaymentGateWay' }),
    TOA_test.belongsTo(model.TOA_currency, { foreignKey: 'currencyId', as: 'currency' }),

    TOA_test.hasMany(model.TOA_test_question,  {foreignKey: 'test_id', as: 'question_list'}),
    TOA_test.hasOne(model.TOA_test_result,  {foreignKey: 'test_id', as: 'testResult'}),
    TOA_test.hasMany(model.TOA_test_result,  {foreignKey: 'test_id', as: 'testResults'}),
    TOA_test.hasMany(model.TOA_student_purchase , { foreignKey: 'type' , as: 'payments'})
    
  };

  return TOA_test;
};
