/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_question_options = sequelize.define('TOA_testbundle_question_options', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      questionId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      option: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      optionMedia: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isAnswer: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
    }, {
      tableName: 'TOA_testbundle_question_options'
    });
  
    TOA_testbundle_question_options.associate = function(model){
  
      TOA_testbundle_question_options.belongsTo(model.TOA_testbundle_question,  {foreignKey: 'questionId' , as: 'question'})
      
    };
  
    return TOA_testbundle_question_options;
  };
  