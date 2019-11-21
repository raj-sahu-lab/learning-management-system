/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_support = sequelize.define('TOA_support', {
    support_id: {
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
    course_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    course: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    support_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    support_description: {
      type: DataTypes.TEXT,
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
    tableName: 'TOA_support'
  });

  TOA_support.associate = function(model){

    TOA_support.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_support.belongsTo(model.TOA_learner,  {foreignKey: 'learner_id'})
  };

  return TOA_support;
};
