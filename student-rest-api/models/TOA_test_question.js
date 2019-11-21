/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_test_question =  sequelize.define('TOA_test_question', {
    test_question_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
   
    test_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    test_question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_question_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: '1-MCQ , 2 - Multi Choice , 3 - Gap Filling , 4 - True/False , 5 - Question Answer'
    },
    test_question_answer1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_question_answer2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_question_answer3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_question_answer4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_question_time: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    test_question_mark: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    test_question_answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_question_explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    test_question_video: {
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
    tableName: 'TOA_test_question'
  });

  TOA_test_question.associate = function(model){

    TOA_test_question.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_test_question.belongsTo(model.TOA_test,  {foreignKey: 'test_id' , as: 'test'}),
    TOA_test_question.hasOne(model.TOA_test_student_answer,  {foreignKey: 'test_question_id' , as: 'studentAnswer'})
    
  };

  return TOA_test_question;
};
