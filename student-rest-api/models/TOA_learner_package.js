/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_learner_package =  sequelize.define('TOA_learner_package', {
    learner_package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    learner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    package_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    course_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    course: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    amount_pay: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    payment_mode: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    paymentgateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    paymentgateway_response: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    learner_device: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    }
   
  }, {
    tableName: 'TOA_learner_package'
  });

  TOA_learner_package.associate = function(model){

    TOA_learner_package.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_learner_package.belongsTo(model.TOA_learner,  {foreignKey: 'learner_id'}),
    TOA_learner_package.belongsTo(model.TOA_package,  {foreignKey: 'package_id'})
  };

  return TOA_learner_package;
};
