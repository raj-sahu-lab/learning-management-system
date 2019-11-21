/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_social =  sequelize.define('TOA_social', {
    social_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    social_facebook: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_twitter: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_google: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_instagram: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_pinterest: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_dribbble: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_linkedin: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_github: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_reddit: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_skype: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_behance: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_foursqare: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_soundcloud: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_spotify: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_stumbleupon: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_youtube: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_dropbox: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_vkontakte: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_steam: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    social_tumblr: {
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
    tableName: 'TOA_social'
  });

  TOA_social.associate = function(model){

    TOA_social.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };

  return TOA_social;
};
