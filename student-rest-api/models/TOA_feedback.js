/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_feedback = sequelize.define('TOA_feedback', {
      feedback_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      ratting: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: true
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: true
      },
     
      update_ip: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'TOA_feedback'
    });
  
    TOA_feedback.associate = function(model){
      TOA_feedback.belongsTo(model.TOA_student,  {foreignKey: 'student_id'})   
    };

    return TOA_feedback;
  };
  