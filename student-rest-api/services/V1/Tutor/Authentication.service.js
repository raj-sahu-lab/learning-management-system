const { TOA_tutor, TOA_branch, TOA_BlueJeance_Users , TOA_account} = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Authenticate User and return the User Object.
module.exports.checkLogin = async function (phone , password) {

    [err, user] = await to(TOA_tutor.findOne({ 
        where: { [Op.or]: [{tutor_phone: phone}, {tutor_email: phone}] , status: 0, delete: 0},
        // where: { tutor_phone: phone , status: 0, delete: 0},
        attributes: [['tutor_id', 'id'], ['account_id' , 'accountId'], ['branch_id' , 'branchId'], ['tutor_image', 'image'], ['tutor_name', 'name'] , 'countryCode' , ['tutor_phone', 'phone'] , ['tutor_email','email'], ['tutor_qualification','qualification'] ,['tutor_password' , 'password'], ['tutor_experience' , 'experience']],
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
                    }
                ]
            },
            {
                model: TOA_BlueJeance_Users,
                as: 'blueJeance',
                required: false,
                attributes: ['id' , 'response'],
            }
        ]
     }));

    if (err) TE(err.message);
    if (!user) TE('Invalid Credentials. Please try again.');

    [err, user] = await to(user.comparePassword(password));
    if (err) TE(err.message);

    return user;
}

module.exports.getTutor = async function (id) {

    [err, user] = await to(TOA_tutor.findOne({ 

        where: { tutor_id: id , status: 0, delete: 0},
     }));

    if (err) TE('Tutor not found');
    if (!user) TE('Tutor not found');

    return user;
}

module.exports.updateTutor = async function (id,userInfo) {

    [err, user] = await to(TOA_tutor.update(userInfo, { where: { tutor_id: id } }));
    if (err) TE(err.message);
    return user;
}


module.exports.getTutorByEmail = async function (email) {

    [err, user] = await to(TOA_tutor.findOne({ 

        where: { tutor_email: email , status: 0, delete: 0},
        attributes: [['tutor_id', 'id'], ['account_id' , 'accountId'], ['branch_id' , 'branchId'], ['tutor_image', 'image'], ['tutor_name', 'name'] , 'countryCode' , ['tutor_phone', 'phone'] , ['tutor_email','email'], ['tutor_qualification','qualification'] ,['tutor_password' , 'password'], ['tutor_experience' , 'experience']],
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
                    }
                ]
            }
        ]
     }));

    if (err) TE('Tutor not found');
    if (!user) TE('Tutor not found');

    return user;
}