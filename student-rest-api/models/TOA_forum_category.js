
module.exports = function (sequelize, DataTypes) {

    var TOA_forum_category = sequelize.define('TOA_forum_category', {
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
        tableName: 'TOA_forum_category'
    });

    TOA_forum_category.associate = function(model){

        TOA_forum_category.belongsTo(model.TOA_account,  {foreignKey: 'account_id' , as: 'account'}),
        TOA_forum_category.hasMany(model.TOA_forum_subject,  {foreignKey: 'category_id' , as: 'subjects'})
      };
    return TOA_forum_category;
};
