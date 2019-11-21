/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_practice_question = sequelize.define('TOA_practice_question', {
    practice_question_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    practice_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    practice_question_question: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    practice_question_answer: {
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
    tableName: 'TOA_practice_question'
  });


  TOA_practice_question.associate = function(model){

    TOA_practice_question.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_practice_question.belongsTo(model.TOA_practice,  {foreignKey: 'practice_id'})
  };

  return TOA_practice_question;
};
