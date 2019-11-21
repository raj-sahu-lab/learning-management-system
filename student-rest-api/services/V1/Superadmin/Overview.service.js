const { TOA_branch , TOA_tutor , TOA_student , TOA_student_institute_relationship ,  TOA_education} = require('../../../models');
const { to, TE } = require('../util.service');

// Get All Branch List
module.exports.getBranchList = async function (whereJSON) {


    var attributesList =  [['branch_id', 'id'],'CODE', ['branch_manager','manager'],['branch_name', 'name'], 'contactCountryCode',['branch_number', 'number'], 'altcontactCountryCode' ,['branch_altnumber', 'altNumber'], ['branch_address', 'address'], ['branch_latitude', 'latitude'], ['branch_longitude', 'longitude'],'status' , 'delete'];

    [err, branchList] = await to(TOA_branch.findAll({

        where: whereJSON,
        order: [['updatedAt', 'DESC']],
        attributes: attributesList

    }));

    if (err) TE(err.message);
    return branchList;

}

module.exports.getTutorList = async function (whereJSON) {

    [err, tutorList] = await to(TOA_tutor.findAll({
        where: whereJSON,
        order: [['updatedAt', 'ASC']],
        attributes: [['tutor_id', 'id'], ['tutor_image', 'image'], ['tutor_name', 'name'], 'countryCode',['tutor_phone', 'phone'], ['tutor_email', 'email'], ['tutor_qualification', 'qualification'],['tutor_experience','experience'] ,'status'],
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

// Get All Learner List
module.exports.getLearnerList = async function (accountId, whereJSON) {

    [err, studentList] = await to(TOA_student.findAll({
        where: whereJSON,
        order: [['id', 'DESC']],
        attributes: ['id', ['education_type_id', 'educationType'], 'image', ['first_name', 'firstName'], ['last_name', 'lastName'], 'countrycode', 'phone', 'email'],
        include: [
            {

                model: TOA_branch,
                as: 'branch',
                where: { account_id: accountId },
                attributes: [['branch_id', 'id'], 'account_id', ['branch_manager', 'manager'], ['branch_name', 'name']],
            },
            {
                model: TOA_education,
                as: 'education',
                required: false,
                attributes: ['id', 'title'],
            }
        ]
    }));

    if (err) TE(err.message);
    return studentList;
}