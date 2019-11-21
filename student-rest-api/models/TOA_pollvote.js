/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_pollvote = sequelize.define('TOA_pollvote', {
    pollvote_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    learner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    poll_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    polloption_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    tableName: 'TOA_pollvote'
  });

  TOA_pollvote.associate = function(model){

    TOA_pollvote.belongsTo(model.TOA_student,  {foreignKey: 'learner_id'}),
    TOA_pollvote.belongsTo(model.TOA_poll,  {foreignKey: 'poll_id'}),
    TOA_pollvote.belongsTo(model.TOA_polloption,  {foreignKey: 'polloption_id'})

  };

  return TOA_pollvote;
};
