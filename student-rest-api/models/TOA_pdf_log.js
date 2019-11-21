/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var TOA_pdf_log = sequelize.define('TOA_pdf_log', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      pdfId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      studentId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      seenDuration:{
        type: DataTypes.DOUBLE,
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
      tableName: 'TOA_pdf_log'
    });
  
    TOA_pdf_log.associate = function(model){
  
      TOA_pdf_log.belongsTo(model.TOA_pdf,  {foreignKey: 'pdfId' , as: 'pdf'}),
      TOA_pdf_log.belongsTo(model.TOA_student,  {foreignKey: 'studentId', as: 'student'})
    };
  
    return TOA_pdf_log;
  };
  