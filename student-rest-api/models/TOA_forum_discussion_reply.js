
module.exports = function (sequelize, DataTypes) {

    var TOA_forum_discussion_reply = sequelize.define('TOA_forum_discussion_reply', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        message_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        student_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        article_id:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
            allowNull: false
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
        tableName: 'TOA_forum_discussion_reply'
    });

    TOA_forum_discussion_reply.associate = function(model){

        TOA_forum_discussion_reply.belongsTo(model.TOA_forum_discussion,  {foreignKey: 'message_id' , as: 'messageP'}),
        TOA_forum_discussion_reply.belongsTo(model.TOA_student,  {foreignKey: 'student_id' , as: 'student'}),
        TOA_forum_discussion_reply.belongsTo(model.TOA_forum_articles,  {foreignKey: 'article_id' , as: 'article'})
      };
    return TOA_forum_discussion_reply;
};
