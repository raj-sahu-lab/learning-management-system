
module.exports = function (sequelize, DataTypes) {

    var TOA_country = sequelize.define('TOA_country', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(255),
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
        tableName: 'TOA_country'
    });

    TOA_country.associate = function (model) {

        TOA_country.hasMany(model.TOA_city, { foreignKey: 'country_id', as: 'citys' })
    };
    return TOA_country;
};
