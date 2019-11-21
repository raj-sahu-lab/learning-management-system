/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_test_student_answer =  sequelize.define('TOA_test_student_answer', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      test_question_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      student_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      test_answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      test_question_taken_time: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'TOA_test_student_answer'
    });
  
    TOA_test_student_answer.associate = function(model){
  
        TOA_test_student_answer.belongsTo(model.TOA_test_question,  {foreignKey: 'test_question_id' , as: 'question'})
      
    };
  
    return TOA_test_student_answer;
  };
  