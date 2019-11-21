const { TOA_student, TOA_student_institute_relationship, TOA_branch, TOA_student_purchase, TOA_education } = require('../../../models');
const { to, TE } = require('../util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const pluck = require('arr-pluck');

// Get All Learner List
module.exports.getLearnerList = async function (accountId, branchId) {

    var whereCondition = { account_id: accountId };
    if (branchId) {
        whereCondition.branch_id = branchId
    }

    [err, studentList] = await to(TOA_student.findAll({
        where: { delete: 0 },
        order: [['id', 'DESC']],
        attributes: ['id', ['education_type_id', 'educationType'], 'image', ['first_name', 'firstName'], ['last_name', 'lastName'], 'countrycode', 'phone', 'email'],
        include: [
            {
                model: TOA_student_institute_relationship,
                as: 'instituteList',
                attributes: ['branch_id', 'isActive'],
                include: [{

                    model: TOA_branch,
                    as: 'branch',
                    where: whereCondition,
                    attributes: [['branch_id', 'id'], 'account_id', ['branch_manager', 'manager'], ['branch_name', 'name']],
                }]
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


// Get All Learner List With name and number
const getLearnerMobileList = async function (accountId) {

    [err, studentList] = await to(TOA_student.findAll({
        where: { delete: 0 },
        order: [['id', 'DESC']],
        attributes: ['id', ['first_name', 'firstName'], ['last_name', 'lastName'], 'countrycode', 'phone'],
        include: [
            {
                model: TOA_student_institute_relationship,
                as: 'instituteList',
                attributes: ['branch_id'],
                include: [{

                    model: TOA_branch,
                    as: 'branch',
                    where: { account_id: accountId },
                    attributes: [],
                }]
            }
        ]
    }));

    if (err) TE(err.message);
    return studentList;
}
module.exports.getLearnerMobileList = getLearnerMobileList;

// Get All Learner List With name and email
const getLearnerEmailList = async function (accountId) {

    [err, studentList] = await to(TOA_student.findAll({
        where: { delete: 0, email: { [Op.ne]: '' }, sendInBlue_id: { [Op.ne]: '' } },
        order: [['id', 'DESC']],
        attributes: ['id', ['first_name', 'firstName'], ['last_name', 'lastName'], 'email', ['sendInBlue_id', 'emailId']],
        include: [
            {
                model: TOA_student_institute_relationship,
                as: 'instituteList',
                attributes: ['branch_id'],
                include: [{

                    model: TOA_branch,
                    as: 'branch',
                    where: { account_id: accountId },
                    attributes: [],
                }]
            }
        ]
    }));

    if (err) TE(err.message);
    return studentList;
}
module.exports.getLearnerEmailList = getLearnerEmailList;


// Update Learner Branch Status
module.exports.updateLearnerBranchStatus = async function (branchId, student_id, updateJSON) {

    [err, learner] = await to(TOA_student_institute_relationship.update(updateJSON, { where: { student_id: student_id, branch_id: branchId } }));
    if (err) TE(err.message);
    return learner;
}


// Update Learner
const updateLearner = async function (learnerId, learnerJson) {

    [err, learner] = await to(TOA_student.update(learnerJson, { where: { id: learnerId } }));
    if (err) TE(err.message);
    return learner;
}
module.exports.updateLearner = updateLearner;

// Delete Learner
module.exports.deleteLearner = async function (learnerId) {

    const learnerJson = { delete: 1 };
    [err, learner] = await to(TOA_student.update(learnerJson, { where: { id: learnerId } }));
    if (err) TE(err.message);
    return learner;

}

module.exports.getLearnerListOfNonPurchased = async function (accountId, purchaseType, id) {

    const currentDate = new Date().toISOString();

    // ,currentDate < (createdAt + dayLimit)

    // [sequelize.literal('(SELECT SUM("Orders"."amount") FROM "Orders" WHERE "Orders"."CustomerId" = "Customer"."id")'), 'totalAmount']

    [err, studentList] = await to(TOA_student_purchase.findAll({
        where: {
            // account_id: accountId, type: purchaseType, typeId: id, createdAt: { $lt: '2021-11-28 10:58:32' }
            account_id: accountId, type: purchaseType, typeId: id, createdAt: { [Op.lt]: [Sequelize.literal('(SELECT  DATEADD(day,dayLimit,createdAt ) as newDate)')] }
        },
        // where:{account_id : accountId , type : { [Op.not]: purchaseType } , typeId : { [Op.not]: id }},
        attributes: ['student_id'],
    }));
    if (err) TE(err.message);


    if (studentList) {

        let ids = pluck(studentList, 'student_id');

        [err, studentList] = await to(TOA_student.findAll({
            where: { delete: 0 },
            order: [['id', 'DESC']],
            attributes: ['id', ['education_type_id', 'educationType'], 'image', ['first_name', 'firstName'], ['last_name', 'lastName'], 'countrycode', 'phone', 'email'],
            include: [
                {
                    model: TOA_student_institute_relationship,
                    as: 'instituteList',
                    where: { student_id: { [Op.notIn]: ids } },
                    attributes: ['branch_id'],
                    include: [{

                        model: TOA_branch,
                        as: 'branch',
                        where: { account_id: accountId },
                        attributes: [],
                    }]
                }
            ]
        }));

        if (err) TE(err.message);
        return studentList;
    } else {

        return [];
    }

}


module.exports.getLearnerListOfPurchased = async function (accountId, purchaseType, id) {


    [err, studentList] = await to(TOA_student_purchase.findAll({
        where: { account_id: accountId, type: purchaseType, typeId: id },
        // where:{account_id : accountId , type : { [Op.not]: purchaseType } , typeId : { [Op.not]: id }},
        attributes: ['student_id'],
    }));
    if (err) TE(err.message);

    if (studentList) {
        let ids = pluck(studentList, 'student_id');


        [err, studentList] = await to(TOA_student.findAll({
            where: { delete: 0 },
            order: [['id', 'DESC']],
            attributes: ['id', ['education_type_id', 'educationType'], 'image', ['first_name', 'firstName'], ['last_name', 'lastName'], 'countrycode', 'phone', 'email'],
            include: [
                {
                    model: TOA_student_institute_relationship,
                    as: 'instituteList',
                    where: { student_id: { [Op.in]: ids } },
                    attributes: ['branch_id'],
                    include: [{

                        model: TOA_branch,
                        as: 'branch',
                        where: { account_id: accountId },
                        attributes: [],
                    }]
                }
            ]
        }));

        if (err) TE(err.message);
        return studentList;
    } else {

        return [];
    }

}