module.exports = function (sequelize, DataTypes) {
  var TOA_campaign_sent = sequelize.define('TOA_campaign_sent', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    campaign_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }, 
    title: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    subject: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    attachmentUrl: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    sent_emails: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    create_ip: {
      type: DataTypes.TEXT,
      allowNull: false
    },

  }, {
    tableName: 'TOA_campaign_sent'
  });

  TOA_campaign_sent.associate = function (model) {

    TOA_campaign_sent.belongsTo(model.TOA_account, { foreignKey: 'account_id' })
  };


  return TOA_campaign_sent;
};
