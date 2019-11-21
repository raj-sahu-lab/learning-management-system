
module.exports = function (sequelize, DataTypes) {

    var TOA_education = sequelize.define('TOA_education', {
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
        tableName: 'TOA_education'
    });

    // TOA_education.associate = function (model) {

    //     TOA_education.hasMany(model.TOA_city, { foreignKey: 'country_id', as: 'citys' })
    // };
    return TOA_education;
};
