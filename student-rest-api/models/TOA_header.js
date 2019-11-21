/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TOA_header', {
    header_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    header_title: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    header_url: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    header_order: {
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
    tableName: 'TOA_header'
  });
};
