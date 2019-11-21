/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_poll = sequelize.define('TOA_poll', {
    poll_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    poll_title: {
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
    tableName: 'TOA_poll'
  });

  TOA_poll.associate = function(model){

    TOA_poll.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_poll.hasMany(model.TOA_polloption,  {foreignKey: 'poll_id', as: 'pollOptions'})

  };

  return TOA_poll;
};
