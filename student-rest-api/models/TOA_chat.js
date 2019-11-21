
module.exports = function (sequelize, DataTypes) {
    // type represents from student or tutor or branch
    var TOA_chat = sequelize.define('TOA_chat', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
            allowNull: false
        },
        chatRoom: {
            type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
            allowNull: false
        },
        student_id:{
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        tutor_id:{
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        account_id:{
            type: DataTypes.INTEGER(11),
            allowNull: true,
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
        }
    }, {
        tableName: 'TOA_chat'
    });

    TOA_chat.associate = function(model){

        TOA_chat.belongsTo(model.TOA_student,  {foreignKey: 'student_id' , as: 'student'}),
        TOA_chat.belongsTo(model.TOA_tutor,  {foreignKey: 'tutor_id' , as: 'tutor'}),
        TOA_chat.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'})

    };
    return TOA_chat;
};
