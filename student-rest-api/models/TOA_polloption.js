/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_polloption = sequelize.define('TOA_polloption', {
    polloption_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    poll_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    polloption_title: {
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
    tableName: 'TOA_polloption'
  });

  TOA_polloption.associate = function(model){

    TOA_polloption.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_polloption.belongsTo(model.TOA_poll,  {foreignKey: 'poll_id', as: 'poll'})
    TOA_polloption.hasMany(model.TOA_pollvote,  {foreignKey: 'polloption_id', as: 'pollAnswer'})
  };


  return TOA_polloption;
};
