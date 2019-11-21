/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_forum = sequelize.define('TOA_forum', {
    forum_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forum_title: {
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
    tableName: 'TOA_forum'
  });

  TOA_forum.associate = function(model){

    TOA_forum.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_forum.hasMany(model.TOA_forumoption,  {foreignKey: 'forum_id', as: 'forumOptions'})
  };



  return TOA_forum;
};
