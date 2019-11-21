/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_privacypolicy =  sequelize.define('TOA_privacypolicy', {
    privacypolicy_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    privacypolicy_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    privacypolicy_description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
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
    tableName: 'TOA_privacypolicy'
  });

  TOA_privacypolicy.associate = function(model){

    TOA_privacypolicy.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };


  return TOA_privacypolicy;
};
