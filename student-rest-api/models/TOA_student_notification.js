/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_student_notification = sequelize.define('TOA_student_notification', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      studentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'TOA_student_notification'
    });
  
    TOA_student_notification.associate = function(model){
  
      TOA_student_notification.belongsTo(model.TOA_student,  {foreignKey: 'studentId' , as: 'account'})
    };
  
    return TOA_student_notification;
  };
  