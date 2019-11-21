/* jshint indent: 2 */
'use strict';
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');/* jshint indent: 2 */
const CryptoJS = require("crypto-js");

module.exports = function(sequelize, DataTypes) {
  var TOA_tutor = sequelize.define('TOA_tutor', {
    tutor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    branch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tutor_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tutor_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    countryCode: {

      type: DataTypes.INTEGER(11),
      allowNull: true

    },
    tutor_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tutor_email: {
      type: DataTypes.STRING(215),
      allowNull: false
    },
    tutor_bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tutor_qualification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tutor_experience: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tutor_password: {
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
    tableName: 'TOA_tutor'
  });

  TOA_tutor.associate = function(model){

    TOA_tutor.belongsTo(model.TOA_account,  {foreignKey: 'account_id'}),
    TOA_tutor.hasOne(model.TOA_subject,  {foreignKey: 'tutor_id' , as: 'subject'}),
    TOA_tutor.hasOne(model.TOA_BlueJeance_Users,  {foreignKey: 'tutorId' , as: 'blueJeance'}),
    TOA_tutor.belongsTo(model.TOA_branch,  {foreignKey: 'branch_id' , as: 'branch'}),
    TOA_tutor.hasMany(model.TOA_chat,  {foreignKey: 'tutor_id' , as: 'chat'})

  };

  TOA_tutor.prototype.getJWT = function () {
    
    const data = { id: this.toJSON().id , userType : 3 , branchId : this.toJSON().branch.id ,  accountId : this.toJSON().branch.account.id};
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({token: ciphertext}, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });

  };

  TOA_tutor.prototype.comparePassword = async function (pw) {
        
    
    if (!this.toJSON().password) TE('Invalid Credentials. Please try again.');

    if (sha1(pw) == this.toJSON().password) {

      return this;
    }
    else {

      TE('Invalid Credentials. Please try again.');
    }
  }
  
  return TOA_tutor;
};
