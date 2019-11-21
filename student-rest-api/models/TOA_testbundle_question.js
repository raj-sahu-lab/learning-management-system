/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_question = sequelize.define('TOA_testbundle_question', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      accountId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      subjectId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      questionMedia: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      question_type: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: '1-MCQ , 2 - Multi Choice , 3 - Filling the blank'
      },
      mark: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER(11),
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
      tableName: 'TOA_testbundle_question'
    });
  
    TOA_testbundle_question.associate = function(model){
      
      TOA_testbundle_question.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account' , onDelete: 'cascade'}),
      TOA_testbundle_question.belongsTo(model.TOA_subject,  {foreignKey: 'subjectId', as: 'subject'}),
      TOA_testbundle_question.hasMany(model.TOA_testbundle_question_options,  {foreignKey: 'questionId', as: 'options'}),
      TOA_testbundle_question.hasMany(model.TOA_testbundle_student_answer,  {foreignKey: 'questionId', as: 'studentAnswers'})
      
    };
  
    return TOA_testbundle_question;
  };
  