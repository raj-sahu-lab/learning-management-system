/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Term = sequelize.define('TOA_term', {
    term_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    term_title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    term_month: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    term_days: {
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
    tableName: 'TOA_term'
  });

  Term.associate = function(model){

    Term.belongsTo(model.TOA_Admin,  {foreignKey: 'account_id'}),
    Term.hasMany(model.TOA_plan,  {foreignKey: 'term_id' , as: 'plan'})
  };

  Term.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Term;
};
