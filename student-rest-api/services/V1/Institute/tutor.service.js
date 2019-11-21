const { TOA_subject, TOA_tutor , TOA_branch , TOA_account, TOA_liveclass_api_key} = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



module.exports.userExist = async function (email) {

    [err, users] = await to(TOA_tutor.findOne({ where: { 

        [Op.or]: [{tutor_email: email}]

      } }));
    if (err) TE(err.message);
    return users;
}

// Add New Tutor
module.exports.addTutor = async function (tutor) {

    [err, tutor] = await to(TOA_tutor.create(tutor));
    if (err) TE(err.message);
    return tutor;
}

// Get Single Tutor
module.exports.getTutor = async function (accountId, tutorId) {

    [err, tutor] = await to(TOA_tutor.findOne({
        where: { account_id: accountId, tutor_id: tutorId, delete: 0 },
        order: [['updatedAt', 'DESC']],
        attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode' ,['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_bio', 'bio'], ['tutor_qualification', 'qualification'],['tutor_experience','experience'] ,'status', 'gender'],
        include: [
            {
                model: TOA_branch,
                as: 'branch',
                required: false,
                attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'name']],
                include: [
                    {
                        model: TOA_account,
                        as: 'account',
                        where: { status: 0, delete: 0 },
                        attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image']],
                    },
                    {
                        model: TOA_liveclass_api_key,
                        as : "liveClassKey",
                        where: { liveclass_type : "zoom", status: 0, delete: 0 },
                        attributes: [['liveclass_apikey', 'key'], ['liveclass_apisecret', 'secret']],
                        required: false
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return tutor;

}

module.exports.getTutorByPhone = async function (phoneNo) {

    [err, tutor] = await to(TOA_tutor.findOne({ where: { tutor_phone: phoneNo, delete: 0 }  }));
    if (err) TE(err.message);
    return tutor;

}

// Get All Tutor List
const getTutorList = async function (user) {

    [err, tutorList] = await to(TOA_tutor.findAll({
        where: { account_id: user.account_id,  delete: 0 },
        order: [['tutor_id', 'DESC']],
        attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode',['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_bio', 'bio'], ['tutor_qualification', 'qualification'],['tutor_experience','experience'] ,'status', 'gender'],
        include: [
            {
                model: TOA_branch,
                as: 'branch',
                attributes: [['branch_id', 'id'],['branch_name', 'name']]
            }
        ]
    }));
    if (err) TE(err.message);
    return tutorList;

}
module.exports.getTutorList = getTutorList;

// Get Filtered Tutor List
const getFilteredTutorList = async function (user) {

    [err, tutorList] = await to(TOA_tutor.findAll({
        where: { account_id: user.account_id,  delete: 0 ,status: 0 },
        order: [['tutor_id', 'DESC']],
        attributes: [['tutor_id', 'id'], ['tutor_name', 'name']],
        include:[{

            model: TOA_subject,
            as: 'subject',
            where: { account_id: user.account_id,  delete: 0 },
            required: false
        }]
    }));
    if (err) TE(err.message);
    return tutorList;

}
module.exports.getFilteredTutorList = getFilteredTutorList;

// Update Tutor
const updateTutor = async function (tutorId, tutorJson) {

    [err, tutor] = await to(TOA_tutor.update(tutorJson, { where: { tutor_id: tutorId } }));
    if (err) TE(err.message);
    return tutor;
}
module.exports.updateTutor = updateTutor;

// Delete Tutor
const deleteTutor = async function (accountId, tutorId) {

    const tutorJson = {delete: 1};
    [err, tutor] = await to(TOA_tutor.update(tutorJson, { where: { account_id: accountId, tutor_id: tutorId } }));
    if (err) TE(err.message);
    return tutor;

}
module.exports.deleteTutor = deleteTutor;


// Get All Tutor By Branch
module.exports.getTutorListByBranch = async function (branchId) {

    [err, tutorList] = await to(TOA_tutor.findAll({
        where: { branch_id: branchId,  delete: 0 },
        order: [['tutor_id', 'DESC']],
        attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode',['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_bio', 'bio'], ['tutor_qualification', 'qualification'],['tutor_experience','experience'] ,'status', 'gender'],
    }));
    if (err) TE(err.message);
    return tutorList;

}