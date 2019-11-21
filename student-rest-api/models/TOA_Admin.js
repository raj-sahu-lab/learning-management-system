'use strict';
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');
const CryptoJS = require("crypto-js");

module.exports = function (sequelize, DataTypes) {

  var Model = sequelize.define('TOA_Admin', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(215),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
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
      tableName: 'TOA_Admin'
    });



  Model.prototype.comparePassword = async function (pw) {
    let err, pass
    if (!this.password) TE('password not set');

    if (sha1(pw) == this.password) {

      return this;
    }
    else {

      TE('Invalid email and password');
    }
  }

  Model.prototype.getJWT = function () {

    let data = { id: this.id };
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({token: ciphertext}, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });

  };

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
