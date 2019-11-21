/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_tutor_notification = sequelize.define('TOA_tutor_notification', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      accountId: {
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
      tableName: 'TOA_tutor_notification'
    });
  
    TOA_tutor_notification.associate = function(model){
  
      TOA_tutor_notification.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account'})
    };
  
    return TOA_tutor_notification;
  };
  