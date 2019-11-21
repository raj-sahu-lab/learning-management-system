/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_audio_log = sequelize.define('TOA_audio_log', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      audioId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      studentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      seenDuration:{
        type: DataTypes.DOUBLE,
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
      tableName: 'TOA_audio_log'
    });
  
    TOA_audio_log.associate = function(model){
  
      TOA_audio_log.belongsTo(model.TOA_audio,  {foreignKey: 'audioId' , as: 'audio'}),
      TOA_audio_log.belongsTo(model.TOA_student,  {foreignKey: 'studentId', as: 'student'})
    };
  
    return TOA_audio_log;
  };
  