/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_test_result =  sequelize.define('TOA_test_result', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      test_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      student_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      correctAnswers: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      totalMarks: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      takenTime: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalQuestions: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      attempted: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'TOA_test_result'
    });
  
    TOA_test_result.associate = function(model){
  
        TOA_test_result.belongsTo(model.TOA_test,  {foreignKey: 'test_id' , as: 'test'}),
        TOA_test_result.belongsTo(model.TOA_student,  {foreignKey: 'student_id' , as: 'student'})
      
    };
  
    return TOA_test_result;
  };
  