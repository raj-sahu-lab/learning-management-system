/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_game = sequelize.define('TOA_game', {
    game_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    subject_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    topic_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tutor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    game_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    game_order: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'TOA_game'
  });

  TOA_game.associate = function(model){

    TOA_game.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_game.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id'})
  };


  return TOA_game;
};
