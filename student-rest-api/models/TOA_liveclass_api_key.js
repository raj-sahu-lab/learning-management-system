module.exports = function (sequelize, DataTypes) {
    var TOA_liveclass_api_key = sequelize.define('TOA_liveclass_api_key', {
        branch_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        liveclass_type: {
            type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_general_ci',
            allowNull: false
        },
        liveclass_apikey: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        liveclass_apisecret: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        android_apikey: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        android_apisecret: {
            type: DataTypes.TEXT,
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
    },{
        tableName: 'TOA_liveclass_api_key'
    });

    TOA_liveclass_api_key.associate = function (model) {

        TOA_liveclass_api_key.belongsTo(model.TOA_branch, { foreignKey: 'branch_id', as: 'branch' })
    };

    return TOA_liveclass_api_key;
};
