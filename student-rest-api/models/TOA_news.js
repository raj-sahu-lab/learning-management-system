/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_news = sequelize.define('TOA_news', {

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
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    news_datetime: {
      type: 'TIMESTAMP',
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
    tableName: 'TOA_news'
  });

  TOA_news.associate = function(model){

    TOA_news.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_news.belongsTo(model.TOA_news_category,  {foreignKey: 'category_id', as: 'newsCategory'})
  };


  return TOA_news;
};
