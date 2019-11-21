/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_video_log = sequelize.define('TOA_video_log', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      videoId: {
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
      tableName: 'TOA_video_log'
    });
  
    TOA_video_log.associate = function(model){
  
      TOA_video_log.belongsTo(model.TOA_video,  {foreignKey: 'videoId' , as: 'video'}),
      TOA_video_log.belongsTo(model.TOA_student,  {foreignKey: 'studentId', as: 'student'})
    };
  
    return TOA_video_log;
  };
  