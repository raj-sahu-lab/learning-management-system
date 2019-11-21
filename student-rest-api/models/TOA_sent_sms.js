
module.exports = function(sequelize, DataTypes) {
    var TOA_sent_sms = sequelize.define('TOA_sent_sms', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      subject: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      sms_length:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      sent_contacts: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      },
     
    }, {
      tableName: 'TOA_sent_sms'
    });
  
    TOA_sent_sms.associate = function(model){
  
      TOA_sent_sms.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
    };
  
  
    return TOA_sent_sms;
  };
  