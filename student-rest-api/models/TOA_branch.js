const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');
const CryptoJS = require("crypto-js");

module.exports = function(sequelize, DataTypes) {
  var  TOA_branch = sequelize.define('TOA_branch', {
    branch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    UUID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CODE: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    branch_manager: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    branch_name: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    contactCountryCode:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_email: {
      type: DataTypes.STRING(215),
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    altcontactCountryCode:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_altnumber: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_address: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pincode: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    branch_latitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_longitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    panNumber: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gstNumber: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'TOA_branch'
  });

  TOA_branch.prototype.getJWT = function () {

    let data = { branch_id: this.branch_id, user_id: this.account_id };
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({token: ciphertext}, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });
  
  };

  TOA_branch.associate = function(model){

    TOA_branch.belongsTo(model.TOA_account,  {foreignKey: 'account_id', as: 'account'}),
    TOA_branch.hasMany(model.TOA_student,  {foreignKey: 'defaultBranch', as: 'students'}),
    TOA_branch.belongsTo(model.TOA_city, { foreignKey: 'city_id', as: 'city' }),
    TOA_branch.belongsTo(model.TOA_country, { foreignKey: 'country_id', as: 'country' }),
    TOA_branch.hasMany(model.TOA_liveclass_api_key,  {foreignKey: 'branch_id', as: 'liveClassKey'})

  };

  return TOA_branch;
};
