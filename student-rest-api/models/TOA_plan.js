/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Plan = sequelize.define('TOA_plan', {
    plan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    term_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    plan_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    plan_amount_usd: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    razerPayPlanId:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    subject_title:{
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    mail_content:{
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
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
    tableName: 'TOA_plan'
  });

  Plan.associate = function(model){

    Plan.belongsTo(model.TOA_Admin,  {foreignKey: 'account_id'}),
    Plan.belongsTo(model.TOA_term,  {foreignKey: 'term_id', as: 'term'}),
    Plan.hasMany(model.TOA_plan_detail,  {foreignKey: 'plan_id', as: 'plan_detail'}),
    Plan.hasMany(model.TOA_Tutor_menu_plan_permission,  {foreignKey: 'plan_id', as: 'planPermissions'})
    
  };

  Plan.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Plan;
};
