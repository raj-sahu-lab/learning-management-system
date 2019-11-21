/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  var TOA_forumcomment = sequelize.define('TOA_forumcomment', {
    forumcomment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    learner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forum_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forumoption_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    forumcomment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    forumcomment_delete: {
      type: DataTypes.INTEGER(11),
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
      tableName: 'TOA_forumcomment'
    });

    TOA_forumcomment.associate = function (model) {

      TOA_forumcomment.belongsTo(model.TOA_account, { foreignKey: 'account_id' }),
      TOA_forumcomment.belongsTo(model.TOA_learner, { foreignKey: 'learner_id' }),
      TOA_forumcomment.belongsTo(model.TOA_forum, { foreignKey: 'forum_id' }),
      TOA_forumcomment.belongsTo(model.TOA_forumoption, { foreignKey: 'forumoption_id' })
  };
  return TOA_forumcomment;
};
