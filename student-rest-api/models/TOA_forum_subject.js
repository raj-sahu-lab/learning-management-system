
module.exports = function (sequelize, DataTypes) {

    var TOA_forum_subject = sequelize.define('TOA_forum_subject', {
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
        category_id:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
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
        tableName: 'TOA_forum_subject'
    });

    TOA_forum_subject.associate = function(model){

        TOA_forum_subject.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'}),
        TOA_forum_subject.belongsTo(model.TOA_forum_category,  {foreignKey: 'category_id' , as: 'category'}),
        TOA_forum_subject.hasMany(model.TOA_forum_topic,  {foreignKey: 'subject_id' , as: 'topics'})
      };
    return TOA_forum_subject;
};
