/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Test_Series_Questions = sequelize.define('TOA_testbundle_Test_Series_Questions', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      testSeriesId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      questionId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
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
      tableName: 'TOA_testbundle_Test_Series_Questions'
    });
  
    TOA_testbundle_Test_Series_Questions.associate = function(model){

      TOA_testbundle_Test_Series_Questions.belongsTo(model.TOA_testbundle_Test_Series,  {foreignKey: 'testSeriesId', as: 'testSeries' , onDelete: 'cascade'}),
      TOA_testbundle_Test_Series_Questions.belongsTo(model.TOA_testbundle_question,  {foreignKey: 'questionId', as: 'question' , onDelete: 'cascade'})
  
    };
  
    return TOA_testbundle_Test_Series_Questions;
  };
  