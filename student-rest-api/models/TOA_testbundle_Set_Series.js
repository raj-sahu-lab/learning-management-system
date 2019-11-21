/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Set_Series = sequelize.define('TOA_testbundle_Set_Series', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      setId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      seriesId: {
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
      tableName: 'TOA_testbundle_Set_Series'
    });
  
    TOA_testbundle_Set_Series.associate = function(model){

      TOA_testbundle_Set_Series.belongsTo(model.TOA_testbundle_Set,  {foreignKey: 'setId', as: 'set' , onDelete: 'cascade'}),
      TOA_testbundle_Set_Series.belongsTo(model.TOA_testbundle_Test_Series,  {foreignKey: 'seriesId', as: 'series' , onDelete: 'cascade'})
  
    };
  
    return TOA_testbundle_Set_Series;
  };
  