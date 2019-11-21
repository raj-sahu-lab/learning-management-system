/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_support_request = sequelize.define('TOA_support_request', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branchId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    studentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "1- Subject , 2 - Topic , 3 - Content , 4 - Test , 5 - Practice , 6 - PDF , 7 - PPT , 8 - Audio , 9 - Video"
    },
    typeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    currentStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      comment: "0 - Created , 1 - Authority Assigned , 2 - Work in progress , 3 - Closed"
    },
    authorityId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 'TOA_support_request'
  });

  TOA_support_request.associate = function(model){

    TOA_support_request.belongsTo(model.TOA_branch,  {foreignKey: 'branchId', as: 'branch'}),
    TOA_support_request.belongsTo(model.TOA_student,  {foreignKey: 'studentId', as: 'student'}),
    TOA_support_request.belongsTo(model.TOA_tutor,  {foreignKey: 'authorityId', as: 'authority'}),
    TOA_support_request.hasMany(model.TOA_support_request_chat,  {foreignKey: 'supportRequestId', as: 'supportChat'})
  };

  return TOA_support_request;
};
