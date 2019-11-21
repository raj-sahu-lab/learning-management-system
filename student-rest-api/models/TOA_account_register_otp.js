module.exports = function(sequelize, DataTypes) {

  var TOA_student_register_otp = sequelize.define('TOA_student_register_otp', {

    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phone_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    otp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    tableName: 'TOA_student_register_otp'
  });
  

  return TOA_student_register_otp;
};
