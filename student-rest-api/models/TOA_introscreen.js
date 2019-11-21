/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_introscreen =  sequelize.define('TOA_introscreen', {
    introscreen_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    introscreen_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    introscreen_text: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    introscreen_media: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    introscreen_fontsize: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    introscreen_padding: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    introscreen_border: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    introscreen_bordercolor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    introscreen_textcolor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    introscreen_background: {
      type: DataTypes.TEXT,
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
    tableName: 'TOA_introscreen'
  });

  TOA_introscreen.associate = function(model){

    TOA_introscreen.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };



  return TOA_introscreen;
};
