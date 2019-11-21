/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_learner_test = sequelize.define('TOA_learner_test', {
    learner_test_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    learner_id: {
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
    test_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_question_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_time1: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    test_mark: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    test_answer: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_confirm: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
      tableName: 'TOA_learner_test'
    });



    TOA_learner_test.associate = function (model) {

      TOA_learner_test.belongsTo(model.TOA_account, { foreignKey: 'account_id' }),
      TOA_learner_test.belongsTo(model.TOA_learner, { foreignKey: 'learner_id' }),
      TOA_learner_test.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id'}),
      TOA_learner_test.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id'}),
      TOA_learner_test.belongsTo(model.TOA_content,  {foreignKey: 'content_id'}),
      TOA_learner_test.belongsTo(model.TOA_test,  {foreignKey: 'test_id'}),
      TOA_learner_test.belongsTo(model.TOA_test_question,  {foreignKey: 'test_question_id'})
  };

  return TOA_learner_test;
};
