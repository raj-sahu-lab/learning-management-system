/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Bundle_Set = sequelize.define('TOA_testbundle_Bundle_Set', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bundleId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      setId: {
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
      tableName: 'TOA_testbundle_Bundle_Set'
    });
  
    TOA_testbundle_Bundle_Set.associate = function(model){

      TOA_testbundle_Bundle_Set.belongsTo(model.TOA_testbundle_Bundle,  {foreignKey: 'bundleId', as: 'bundle' , onDelete: 'cascade'}),
      TOA_testbundle_Bundle_Set.belongsTo(model.TOA_testbundle_Set,  {foreignKey: 'setId', as: 'set' , onDelete: 'cascade'})
  
    };
  
    return TOA_testbundle_Bundle_Set;
  };
  