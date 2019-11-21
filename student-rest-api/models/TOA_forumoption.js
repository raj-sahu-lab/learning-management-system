/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var  TOA_forumoption =  sequelize.define('TOA_forumoption', {
    forumoption_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forum_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forumoption_title: {
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
    tableName: 'TOA_forumoption'
  });

  TOA_forumoption.associate = function(model){

    TOA_forumoption.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_forumoption.belongsTo(model.TOA_forum, { foreignKey: 'forum_id', as: 'forum' })
  };

  return TOA_forumoption;
};
