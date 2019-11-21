/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Test_Series = sequelize.define('TOA_testbundle_Test_Series', {
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
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      preview: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timed: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      timeEqual: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      marked: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      markEqual: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      totalMarks: {
        type: DataTypes.FLOAT,
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
      tableName: 'TOA_testbundle_Test_Series'
    });
  
    TOA_testbundle_Test_Series.associate = function(model){
      
      TOA_testbundle_Test_Series.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account' , onDelete: 'cascade'}),
      TOA_testbundle_Test_Series.hasOne(model.TOA_testbundle_student_result,  {foreignKey: 'seriesId', as: 'studentAnswer'}),
      TOA_testbundle_Test_Series.hasMany(model.TOA_testbundle_Test_Series_Questions,  {foreignKey: 'testSeriesId', as: 'questionList'})
      
    };
  
    return TOA_testbundle_Test_Series;
  };
  