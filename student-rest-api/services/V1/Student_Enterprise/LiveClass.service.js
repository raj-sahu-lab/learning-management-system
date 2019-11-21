const { TOA_live_classes, TOA_liveclass_api_key } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.getLiveClassList = async function (studentId) {
    [err, liveClassList] = await to(TOA_live_classes.findAll({

        where: {  studentIds :  { [Op.like]: '%'+studentId+'%' }, delete: 0 },
        attributes: ['id','userType', 'image', 'title', 'scheduleTime' , 'duration' ,'agenda' , 'response'],
    }));    
    if (err) TE(err.message);
    return liveClassList;
}

module.exports.getLiveClassKey = async function (branchId) {
    [err, liveClassKey] = await to(TOA_liveclass_api_key.findOne({

        where: {  branch_id :  branchId, delete: 0, status:0, liveclass_type: 'zoom' },
        attributes: [['liveclass_apikey', 'key'], ['liveclass_apisecret', 'secret'], ['liveclass_type', 'type']]
    }));    
    if (err) TE(err.message);
    return liveClassKey;
}