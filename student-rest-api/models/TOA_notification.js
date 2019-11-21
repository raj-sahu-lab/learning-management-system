/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_notification = sequelize.define('TOA_notification', {
    notification_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    notification_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notification_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notification_order: {
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
    tableName: 'TOA_notification'
  });

  TOA_notification.associate = function(model){

    TOA_notification.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };


  return TOA_notification;
};
