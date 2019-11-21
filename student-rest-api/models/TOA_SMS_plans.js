
module.exports = function(sequelize, DataTypes) {
    var TOA_SMS_plans = sequelize.define('TOA_SMS_plans', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      countryId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      planType:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
        allowNull: false
      },
      totalCount: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      amountUSD: {
        type: DataTypes.FLOAT,
        allowNull: false
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
      tableName: 'TOA_SMS_plans'
    });
  
    TOA_SMS_plans.associate = function(model){
      TOA_SMS_plans.belongsTo(model.TOA_country,  {foreignKey: 'countryId', as: 'country'})
    };
  
    return TOA_SMS_plans;
  };
  