'use strict';
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');
const CryptoJS = require("crypto-js");

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define('TOA_account', {
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UUID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CODE: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    countryCode: {
      type: DataTypes.STRING(255),
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
    currency_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 2
    },
    pin_code: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    account_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_email: {
      type: DataTypes.STRING(215),
      allowNull: false
    },
    account_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_domain: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    account_apikey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sib_folder_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zoomId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    razerPaySubscriptionId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notificationToken:{
      type: DataTypes.STRING(500),
      allowNull: true
    },
    accessToken:{
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_marketplace_enable:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    accessLevel:{
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 2,
      comment: "1- Web Only , 2 - Web+App, 3 - App Only"
    },
    time_zone: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'America/Los_Angeles'
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
      tableName: 'TOA_account'
    });



  Model.prototype.comparePassword = async function (pw) {
    let err, pass
    
    if (!this.account_password) TE('Invalid Credentials. Please try again.');
    
    if (sha1(pw) == this.account_password) {

      return this;
    }
    else {

      TE('Invalid Credentials. Please try again.');
    }
  }

  Model.prototype.getJWT = function () {

    let data = { user_id: this.account_id , userType : 1};
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({token: ciphertext}, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });
  };


  Model.prototype.getJWTWebsite = function (studentId) {

    
    let data = { id: this.toJSON().id , studentId : studentId};
    
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({token: ciphertext}, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });
  };

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  Model.associate = function(model){

    Model.hasOne(model.TOA_about,  {foreignKey: 'account_id' , as: 'aboutUs'}),
    Model.hasOne(model.TOA_privacypolicy,  {foreignKey: 'account_id' , as: 'privacyPolicy'}),
    Model.belongsTo(model.TOA_city,  {foreignKey: 'city_id' , as: 'city'}),
    Model.hasMany(model.TOA_branch,  {foreignKey: 'account_id' , as: 'branches'}),
    Model.hasMany(model.TOA_plan_purchase,  {foreignKey: 'account_id' , as: 'purchaseList'}),
    Model.belongsTo(model.TOA_country,  {foreignKey: 'country_id' , as: 'country'}),
    Model.belongsTo(model.TOA_currency, { foreignKey: 'currency_id', as: 'currency' })

  };

  return Model;
};
