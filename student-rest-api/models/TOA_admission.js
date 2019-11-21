/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {

  var Model = sequelize.define('TOA_admission', {
    admission_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    student_id: {
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
      tableName: 'TOA_admission',
    });

  Model.associate = function (model) {

    Model.belongsTo(model.TOA_account, { foreignKey: 'account_id' })
  };

  return Model;
};
