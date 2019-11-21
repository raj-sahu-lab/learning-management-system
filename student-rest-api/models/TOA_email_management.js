
module.exports = function(sequelize, DataTypes) {
    var TOA_email_management = sequelize.define('TOA_email_management', {
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
      total_email: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      create_ip: {
        type: DataTypes.TEXT,
        allowNull: false
      },
     
    }, {
      tableName: 'TOA_email_management'
    });
  
    TOA_email_management.associate = function(model){
  
      TOA_email_management.belongsTo(model.TOA_account,  {foreignKey: 'institute_id', as: 'institute'})
    };
  
  
    return TOA_email_management;
  };
  