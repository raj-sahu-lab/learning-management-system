const { TOA_review, TOA_subject, TOA_account, TOA_student, TOA_student_institute_relationship, TOA_branch } = require('../../../models');
const { to, TE } = require('../util.service');

module.exports.reviewList = async function (account_id) {

    [err, reviewList] = await to(TOA_review.findAll({

        where: { delete: 0, status: 0 },
        attributes: ['review_id', 'student_id', 'type', 'typeId', 'rating', 'review', ['createdAt', 'addedDate']],
        include: [
            {
                model: TOA_student,
                as: 'student',
                required: true,
                attributes: ['id', 'phone', 'first_name', 'last_name'],
                include: [
                    {
                        model: TOA_branch,
                        as: 'branch',
                        where: {account_id: account_id },
                        attributes: [['branch_id', 'id'], 'account_id', ['branch_manager', 'manager'], ['branch_name', 'name']],
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return reviewList;

}

module.exports.getSubject = async function (subjectId) {

    [err, subject] = await to(TOA_subject.findOne({

        where: { subject_id: subjectId, delete: 0 },
        attributes: [['subject_id', 'id'], ['subject_title', 'title'], 'validity', ['tutor_id', 'tutorId']],
        include: [
            {
                model: TOA_account,
                as: 'account',
                attributes: [['account_id', 'id'], ['account_title', 'title'], ['account_image', 'image'], 'countryCode', ['account_phone', 'phone'], ['account_email', 'email']],
            }
        ]
    }));
    if (err) TE(err.message);
    return subject;

}