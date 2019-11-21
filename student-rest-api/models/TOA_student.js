'use strict';
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');/* jshint indent: 2 */
const CryptoJS = require("crypto-js");

module.exports = function (sequelize, DataTypes) {
  var TOA_student = sequelize.define('TOA_student', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    education_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    countrycode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
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
    gender: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    device_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sendInBlue_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    defaultBranch: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    deviceType: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "1- Android , 2- IOS , 3- Web"
    },
    notificationToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    webDeviceId : {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    webDeviceToken : {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
 
    androidDeviceId : {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    androidDeviceToken : {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    time_zone: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'Asia/Kolkata'
    },
    verified: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'TOA_student'
  });

  TOA_student.associate = function (model) {

    TOA_student.hasOne(model.TOA_student_institute_relationship, { foreignKey: 'student_id', as: 'instituteList' }),
      TOA_student.belongsTo(model.TOA_branch, { foreignKey: 'defaultBranch', as: 'branch' }),
      TOA_student.hasOne(model.TOA_feedback, { foreignKey: 'student_id', as: 'feedBack' }),
      TOA_student.belongsTo(model.TOA_city, { foreignKey: 'city_id', as: 'city' }),
      TOA_student.belongsTo(model.TOA_education, { foreignKey: 'education_type_id', as: 'education' }),
      TOA_student.hasMany(model.TOA_student_purchase, { foreignKey: 'student_id', as: 'purchases' })

  };

  TOA_student.prototype.getJWT = function () {

    var data = { id: this.id };
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    return jwt.sign({ token: ciphertext }, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });

  };

  TOA_student.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  TOA_student.prototype.comparePassword = async function (pw) {
    let err, pass
    if (!this.password) TE('password not set');

    if (sha1(pw) == this.password) {

      return this;
    }
    else {

      TE('Invalid Credentials. Please try again.');
    }
  }

  return TOA_student;
};
