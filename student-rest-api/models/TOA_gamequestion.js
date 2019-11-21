/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_gamequestion = sequelize.define('TOA_gamequestion', {
    gamequestion_id: {
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
    game_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tutor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    gamequestion_question: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    gamequestion_answer: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    gamequestion_order: {
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
    tableName: 'TOA_gamequestion'
  });

  TOA_gamequestion.associate = function(model){

    TOA_gamequestion.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_gamequestion.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id'}),
    TOA_gamequestion.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id'}),
    TOA_gamequestion.belongsTo(model.TOA_game,  {foreignKey: 'game_id'}),
    TOA_gamequestion.belongsTo(model.TOA_tutor,  {foreignKey: 'tutor_id'})
  };
  return TOA_gamequestion;
};
