/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_package = sequelize.define('TOA_package', {
    package_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    package_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    package_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    paymentgateway_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    course_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    course: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
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
    tableName: 'TOA_package'
  });
  
  TOA_package.associate = function(model){

    TOA_package.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };

  return TOA_package;
};
