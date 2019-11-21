module.exports = function(sequelize, DataTypes) {

  var TOA_student_institute_relationship = sequelize.define('TOA_student_institute_relationship', {

    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
        type: DataTypes.INTEGER(11),
      allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER(11),
      allowNull: false
    },
    isActive: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      default : 1,
      comment: "1- Active , 0 - In-Active"
  },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    tableName: 'TOA_student_institute_relationship'
  });
  
  TOA_student_institute_relationship.associate = function(model){

    TOA_student_institute_relationship.belongsTo(model.TOA_branch,  {foreignKey: 'branch_id', as: 'branch'}),
    TOA_student_institute_relationship.belongsTo(model.TOA_student,  {foreignKey: 'student_id', as: 'student'})
    
  };

  return TOA_student_institute_relationship;
};
