/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_practice = sequelize.define('TOA_practice', {
    practice_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    branch_id: {
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
    content_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    practice_title: {
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
    tableName: 'TOA_practice'
  });

  TOA_practice.associate = function(model){

    TOA_practice.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_practice.belongsTo(model.TOA_subject,  {foreignKey: 'subject_id', as: 'subject'}),
    TOA_practice.belongsTo(model.TOA_topic,  {foreignKey: 'topic_id', as: 'topic'}), 
    TOA_practice.belongsTo(model.TOA_content,  {foreignKey: 'content_id', as: 'content'}),
    TOA_practice.hasMany(model.TOA_practice_question,  {foreignKey: 'practice_id' , as: 'question_list'})
  };

  return TOA_practice;
};
