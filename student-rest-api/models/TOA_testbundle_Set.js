/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    var TOA_testbundle_Set = sequelize.define('TOA_testbundle_Set', {
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
      tableName: 'TOA_testbundle_Set'
    });
  
    TOA_testbundle_Set.associate = function(model){
      
      TOA_testbundle_Set.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account' , onDelete: 'cascade'}),
      TOA_testbundle_Set.hasMany(model.TOA_testbundle_Set_Series,  {foreignKey: 'setId', as: 'seriesList'})
      
    };
  
    return TOA_testbundle_Set;
  };
  