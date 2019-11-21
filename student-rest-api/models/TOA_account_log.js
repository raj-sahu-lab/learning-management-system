/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_account_log = sequelize.define('TOA_account_log', {
    account_log_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    login_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'TOA_account_log'
  });

  
  TOA_account_log.associate = function(model){

    TOA_account_log.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };

  return TOA_account_log;
};
