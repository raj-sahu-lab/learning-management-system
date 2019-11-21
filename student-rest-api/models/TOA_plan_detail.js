/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PlanDetail =  sequelize.define('TOA_plan_detail', {
    plan_detail_id: {
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
    plan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    plan_detail_title: {
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
    tableName: 'TOA_plan_detail'
  });


  PlanDetail.associate = function(model){
    
    PlanDetail.belongsTo(model.TOA_Admin,  {foreignKey: 'account_id'}),
    PlanDetail.belongsTo(model.TOA_term,  {foreignKey: 'term_id', as: 'term'}),
    PlanDetail.belongsTo(model.TOA_plan,  {foreignKey: 'plan_id', as: 'plan'})
  };

  PlanDetail.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return PlanDetail;
};
