/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_splashscreen = sequelize.define('TOA_splashscreen', {
    splashscreen_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    splashscreen_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    splashscreen_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    splashscreen_media: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    splashscreen_fontsize: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    splashscreen_padding: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    splashscreen_border: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    splashscreen_bordercolor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    splashscreen_textcolor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    splashscreen_background: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'TOA_splashscreen'
  });

  TOA_splashscreen.associate = function(model){

    TOA_splashscreen.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };
  
  return TOA_splashscreen;
};
