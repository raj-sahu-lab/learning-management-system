/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_review =  sequelize.define('TOA_review', {
    review_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
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
    rating: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    delete: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    tableName: 'TOA_review'
  });

  TOA_review.associate = function(model){

    TOA_review.belongsTo(model.TOA_student,  {foreignKey: 'student_id', as: 'student'})
  };

  return TOA_review;
};
