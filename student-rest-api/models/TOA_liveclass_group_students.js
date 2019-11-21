module.exports = function (sequelize, DataTypes) {
    var TOA_liveclass_group_students = sequelize.define('TOA_liveclass_group_students', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        group_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        student_id: {
            type: DataTypes.INTEGER(11),
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
        tableName: 'TOA_liveclass_group_students'
    });

    TOA_liveclass_group_students.associate = function (model) {
        TOA_liveclass_group_students.belongsTo(model.TOA_liveclass_group, { foreignKey: 'group_id' })
        TOA_liveclass_group_students.belongsTo(model.TOA_student, { foreignKey: 'student_id', as: 'student' })
    };

    return TOA_liveclass_group_students;
};
