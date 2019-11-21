
module.exports = function(sequelize, DataTypes) {
    var TOA_sms = sequelize.define('TOA_sms', {
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
      institute_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      transactionId: {
        type: DataTypes.TEXT,
        allowNull: true
     },
      total_sms: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      },
     
    }, {
      tableName: 'TOA_sms'
    });
  
    TOA_sms.associate = function(model){
  
      TOA_sms.belongsTo(model.TOA_account,  {foreignKey: 'institute_id', as: 'institute'})
    };
  
  
    return TOA_sms;
  };
  