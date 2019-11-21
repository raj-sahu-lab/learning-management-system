/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_student_result = sequelize.define('TOA_testbundle_student_result', {
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
      studentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      bundleId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      setId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      seriesId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      correctAnswers: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      totalMarks: {
        type: DataTypes.FLOAT,
        allowNull: true
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
      tableName: 'TOA_testbundle_student_result'
    });
  
    TOA_testbundle_student_result.associate = function(model){
      
      TOA_testbundle_student_result.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account' , onDelete: 'cascade'}),
      TOA_testbundle_student_result.belongsTo(model.TOA_student,  {foreignKey: 'studentId' , as: 'student' , onDelete: 'cascade'}),
      TOA_testbundle_student_result.belongsTo(model.TOA_testbundle_Bundle,  {foreignKey: 'bundleId' , as: 'bundle' , onDelete: 'cascade'}),
      TOA_testbundle_student_result.belongsTo(model.TOA_testbundle_Test_Series,  {foreignKey: 'seriesId' , as: 'series' , onDelete: 'cascade'}),
      TOA_testbundle_student_result.belongsTo(model.TOA_testbundle_Set,  {foreignKey: 'setId' , as: 'set' , onDelete: 'cascade'}),
      TOA_testbundle_student_result.hasMany(model.TOA_testbundle_student_answer,  {foreignKey: 'studentResultId', as: 'answerList'})
      
    };
  
    return TOA_testbundle_student_result;
  };
  