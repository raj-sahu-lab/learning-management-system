/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_student_answer = sequelize.define('TOA_testbundle_student_answer', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      studentResultId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      studentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      questionId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      questionAnswerId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      takenTime: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'TOA_testbundle_student_answer'
    });
  
    TOA_testbundle_student_answer.associate = function(model){
      
      TOA_testbundle_student_answer.belongsTo(model.TOA_testbundle_student_result,  {foreignKey: 'studentResultId' , as: 'result' , onDelete: 'cascade'}),
      TOA_testbundle_student_answer.belongsTo(model.TOA_student,  {foreignKey: 'studentId' , as: 'student' , onDelete: 'cascade'}),
      TOA_testbundle_student_answer.belongsTo(model.TOA_testbundle_question,  {foreignKey: 'questionId' , as: 'question' , onDelete: 'cascade'}),
      TOA_testbundle_student_answer.belongsTo(model.TOA_testbundle_question_options,  {foreignKey: 'questionAnswerId' , as: 'questionAnswer' , onDelete: 'cascade'})
      
    };
  
    return TOA_testbundle_student_answer;
  };
  