
module.exports = function (sequelize, DataTypes) {

    var TOA_city = sequelize.define('TOA_city', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        country_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        title: {
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
        tableName: 'TOA_city'
    });

    TOA_city.associate = function(model){

        TOA_city.belongsTo(model.TOA_country,  {foreignKey: 'country_id' , as: 'country'})
      };
    return TOA_city;
};
