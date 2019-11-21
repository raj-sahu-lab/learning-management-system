module.exports = function (sequelize, DataTypes) {
    var TOA_student_purchase = sequelize.define('TOA_student_purchase', {
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
        student_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            comment: "1- Subject , 2 - Topic , 3 - Content , 4 - Test , 5 - Practice , 6 - PDF , 7 - PPT , 8 - Audio , 9 - Video , 10 - Test Bundle"
        },
        typeId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        dayLimit: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        create_ip: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'TOA_student_purchase'
    });

    TOA_student_purchase.associate = function (model) {
        TOA_student_purchase.belongsTo(model.TOA_account, { foreignKey: 'account_id', as: 'account' }),
        TOA_student_purchase.belongsTo(model.TOA_student, { foreignKey: 'student_id', as: 'student' }),
        TOA_student_purchase.hasOne(model.TOA_student_purchase_detail, { foreignKey: 'purchase_id', as: 'payments' })
    };

    return TOA_student_purchase;
};
