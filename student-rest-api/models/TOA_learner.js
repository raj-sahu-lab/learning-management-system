'use strict';
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/V1/util.service');
const CONFIG = require('../config/config');
const sha1 = require('sha1');/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TOA_learner = sequelize.define('TOA_learner', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
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
    address: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    occupation: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    standard: {
      type: DataTypes.TEXT  + ' CHARSET utf8 COLLATE utf8_general_ci',
      allowNull: false
    },
    marketing_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    device_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    fcm_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_id: {
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
    tableName: 'TOA_learner'
  });
  
  TOA_learner.associate = function(model){

    TOA_learner.belongsTo(model.TOA_account,  {foreignKey: 'account_id'})
  };

  TOA_learner.prototype.getJWT = function () {
    return jwt.sign({ id: this.id }, CONFIG.jwt_encryption, { expiresIn: CONFIG.jwt_expiration });
  };

  TOA_learner.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  TOA_learner.prototype.comparePassword = async function (pw) {
    let err, pass
    if (!this.account_password) TE('password not set');

    if (sha1(pw) == this.account_password) {

      return this;
    }
    else {

      TE('Invalid email and password');
    }
  }

  return TOA_learner;
};
