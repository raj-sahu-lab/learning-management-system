const { TOA_student, TOA_city, TOA_country, TOA_education , TOA_student_register_otp, TOA_student_institute_relationship, TOA_branch, TOA_account, TOA_feedback } = require('../../../models');
const validator = require('validator');
const { to, TE } = require('../util.service');

module.exports.getStudentByPhone = async function (phoneNumber) {

    let user;

    if (validator.isMobilePhone(phoneNumber, 'any')) {

        [err, user] = await to(TOA_student.findOne({
            where: { phone: phoneNumber , status: 0 , delete : 0}
        }));
        if (err) TE(err.message);

    } else {

        TE('A valid phone number was not entered');
    }

    if (!user) TE('Invalid Credentials. Please try again.');
    return user;
}

// Authenticate User and return the User Object.
module.exports.authUser = async function (userInfo) {

    let user;

    if (validator.isMobilePhone(userInfo.phone, 'any')) {

        [err, user] = await to(TOA_student.findOne({
            where: { phone: userInfo.phone ,verified: 0, status: 0 , delete : 0}
        }));
        if (err) TE(err.message);

    } else {

        TE('A valid phone number was not entered');
    }

    if (!user) TE('Invalid Credentials. Please try again.');

    [err, user] = await to(user.comparePassword(userInfo.password));
    if (err) TE(err.message);

    return user;
}

module.exports.getStudent = async function (studentId) {

    [err, student] = await to(TOA_student.findOne({

        where: { id: studentId , status: 0 , delete : 0},
        attributes: ['id', ['education_type_id', 'educationType'], 'image', ['first_name', 'firstName'], ['last_name', 'lastName'], 'phone', 'email', 'pincode', 'gender','time_zone'],
        include: [
            {
               model: TOA_student_institute_relationship,
                as: 'instituteList',
                required: false,
                attributes: ['branch_id' , 'isActive'],
                include: [{

                    model: TOA_branch,
                    as: 'branch',
                    where: { status: 0, delete: 0 },
                    attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'name']],
                    include:[
                        {
                            model: TOA_account,
                            as: 'account',
                            where: { status: 0, delete: 0 },
                            attributes: [['account_id', 'id'], ['account_title', 'title'] , ['account_image', 'image'] , ['is_marketplace_enable' , 'is_MarketplaceEnable'], 'accessLevel', 'accessToken'],
                        },
                    ]
                }]
            },
            {
                required: false,
                model: TOA_branch,
                as: 'branch',
                attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'name']],
                include:[
                    {
                        model: TOA_account,
                        as: 'account',
                        attributes: [['account_id', 'id'], ['account_title', 'title'] , ['account_image', 'image'], ['is_marketplace_enable' , 'is_MarketplaceEnable'], 'accessLevel', 'accessToken'],
                    },
                ]
                
            },
            {
                model: TOA_feedback,
                as: 'feedBack',
                attributes: [['feedback_id', 'id'], 'ratting', 'description'],
                required: false

            }, {
                model: TOA_education,
                as: 'education',
                attributes: ['id', 'title'],
                required: false

            },
            {
                model: TOA_city,
                as: 'city',
                attributes: ['id', 'title'],
                required: false,
                include: [
                    {
                        model: TOA_country,
                        as: 'country',
                        attributes: ['id', 'title']
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return student;
}

module.exports.getStudentNotificationToken = async function (studentId) {

    [err, student] = await to(TOA_student.findOne({

        where: { id: studentId , status: 0 , delete : 0}
    }));
    if (err) TE(err.message);
    return student;
}

// Check Learner is Exist in Learner Table or not
module.exports.studentExistbyPhone = async function (phoneNo) {

    [err, user] = await to(TOA_student.findOne({ where: { phone: phoneNo } }));
    if (err) TE(err.message);
    return user;
}

module.exports.studentExistByPassword = async function (id, password) {

    [err, user] = await to(TOA_student.findOne({ where: { id: id, password: password } }));
    if (err) TE(err.message);
    return user;
}


//Check Learner Exist in Temp. Register Table. to determine weather Learner Tried before register or not
module.exports.studentExistInTempRegister = async function (phoneNo) {

    [err, user] = await to(TOA_student_register_otp.findOne({ where: { phone_no: phoneNo } }));
    if (err) TE(err.message);
    return user;
}

// Adding New Studnt to Temp Table for registration process
module.exports.addUserToOTP = async function (otpJson) {

    [err, userOTP] = await to(TOA_student_register_otp.create(otpJson));
    if (err) TE(err.message);
    return userOTP;
}


module.exports.deleteStudentFromTemp = async function (phoneNo) {

    [err, isSuccess] = await to(TOA_student_register_otp.destroy({ where: { phone_no: phoneNo } }));
    if (err) TE(err.message);
    return isSuccess;
}


// Adding New Studnt to Temp Table for registration process
module.exports.updateUserToOTP = async function (otpJson, idOfUser) {

    [err, userOTP] = await to(TOA_student_register_otp.update(otpJson, { where: { id: idOfUser } }));
    if (err) TE(err.message);
    return userOTP;
}

module.exports.checkOTPIsValid = async function (phoneNo, userOtp) {

    [err, user] = await to(TOA_student_register_otp.findOne({ where: { phone_no: phoneNo, otp: userOtp + '' } }));
    if (err) TE(err.message);
    return user;
}

// Adding New Studnt to Temp Table for registration process
module.exports.registerStudent = async function (studentJson) {

    [err, student] = await to(TOA_student.create(studentJson));
    if (err) TE(err.message);
    return student;
}

module.exports.addInstitutes = async function (instituteList) {

    [err, instituteList] = await to(TOA_student_institute_relationship.bulkCreate(instituteList));
    if (err) TE(err.message);
    return instituteList;
}

module.exports.studentAlreadyInInstitute = async function (instituteId, studentId) {

    [err, institute] = await to(TOA_student_institute_relationship.findOne({ where: { student_id: studentId, branch_id: instituteId } }));
    if (err) TE(err.message);
    return institute;
}
// Send Forgot password link
module.exports.forGotPasswordReset = async function (phone) {

    [err, user] = await to(TOA_student.findOne({ where: { phone: phone } }));
    if (err) TE(err.message);
    return user;
}

// Send Forgot password link
module.exports.updatePassword = async function (phone, password) {

    [err, user] = await to(TOA_student.update({ password: password }, { where: { phone: phone } }));
    if (err) TE(err.message);
    return user;
}

module.exports.updateStudent = async function (studentId, studentInfo) {

    [err, user] = await to(TOA_student.update(studentInfo, { where: { id: studentId } }));
    if (err) TE(err.message);
    return user;
}

module.exports.getBranchByCode = async function (code) {

    [err, branch] = await to(TOA_branch.findOne({ where: { CODE: code } }));
    if (err) TE(err.message);
    return branch;
}
// All Institute List
module.exports.instituteList = async function () {

    [err, instituteList] = await to(TOA_branch.findAll({

        where: { status: 0, delete: 0 },
        attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'title']],
        include: [
            {
                model: TOA_account,
                as: 'account',
                where: { status: 0, delete: 0 , is_marketplace_enable: 1},
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image']],
            }
        ]
    }));
    if (err) TE(err.message);
    return instituteList;
}

module.exports.studentSelectedInstituteList = async function (studentId) {


    [err, instituteList] = await to(TOA_student_institute_relationship.findAll({

        where: { student_id: studentId },
        include: [
            {
                model: TOA_branch,
                as: 'branch',
                where: { status: 0, delete: 0 },
                attributes: [['branch_id', 'id'], ['branch_manager', 'manager'], ['branch_name', 'title']],
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
    if (err) TE(err.message);
    return instituteList;
}

// Updating student basic information
module.exports.updatePersonalInfo = async (studentInfo, studentId) => {

    [err, student] = await to(TOA_student.update(studentInfo, { where: { id: studentId } }));
    if (err) TE(err.message);
    return student;
}