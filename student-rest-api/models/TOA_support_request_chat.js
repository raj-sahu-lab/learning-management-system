
module.exports = function (sequelize, DataTypes) {

    var TOA_support_request_chat = sequelize.define('TOA_support_request_chat', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        studentId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        authorityId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        accountId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        supportRequestId:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
            allowNull: false
        },
        read: {
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
        tableName: 'TOA_support_request_chat'
    });

    TOA_support_request_chat.associate = function(model){

        TOA_support_request_chat.belongsTo(model.TOA_student,  {foreignKey: 'studentId' , as: 'student'}),
        TOA_support_request_chat.belongsTo(model.TOA_tutor,  {foreignKey: 'authorityId' , as: 'authority'}),
        TOA_support_request_chat.belongsTo(model.TOA_account,  {foreignKey: 'accountId' , as: 'account'}),
        TOA_support_request_chat.belongsTo(model.TOA_support_request,  {foreignKey: 'supportRequestId' , as: 'supportRequest'})

      };
    return TOA_support_request_chat;
};
