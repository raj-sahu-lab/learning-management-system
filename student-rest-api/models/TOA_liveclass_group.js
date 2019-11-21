module.exports = function (sequelize, DataTypes) {
    var TOA_liveclass_group = sequelize.define('TOA_liveclass_group', {
        group_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        group_name: {
            type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
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
        tableName: 'TOA_liveclass_group'
    });

    TOA_liveclass_group.associate = function (model) {
        TOA_liveclass_group.hasMany(model.TOA_liveclass_group_students, { foreignKey: 'group_id', as: 'group' })
    };

    return TOA_liveclass_group;
};
