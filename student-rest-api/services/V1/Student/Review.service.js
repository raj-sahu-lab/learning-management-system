const { TOA_review, TOA_about, TOA_student, TOA_branch, TOA_account , TOA_privacypolicy } = require('../../../models');
const { to, TE } = require('../util.service');


module.exports.addReview = async function (reviewJson) {

    [err, review] = await to(TOA_review.create(reviewJson));
    if (err) TE(err.message);
    return review;
}

module.exports.reviewList = async function (studentId) {

    [err, reviewList] = await to(TOA_review.findAll({

        where: { student_id: studentId, delete: 0, status: 0 },
        attributes: [['review_id', 'id'], 'rating', 'review', ['createdAt', 'addedDate']],

    }))
    if (err) TE(err.message);
    return reviewList;

}

module.exports.getAboutUs = async function (studentId) {

    [err, aboutUs] = await to(TOA_student.findOne({

        where: { id: studentId },
        include: [
            {
                model: TOA_branch,
                as: 'branch',
                include: [
                    {
                        model: TOA_account,
                        as: 'account',
                        include: [

                            {
                                model: TOA_about,
                                as: 'aboutUs',
                                attributes: [['about_title', 'title'],['about_description', 'description']],
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return aboutUs;
}



module.exports.getPrivacyPolices = async function (studentId) {

    [err, aboutUs] = await to(TOA_student.findOne({

        where: { id: studentId },
        include: [
            {
                model: TOA_branch,
                as: 'branch',
                include: [
                    {
                        model: TOA_account,
                        as: 'account',
                        include: [

                            {
                                model: TOA_privacypolicy,
                                as: 'privacyPolicy',
                                attributes: [['privacypolicy_title', 'title'],['privacypolicy_description', 'description']],
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if (err) TE(err.message);
    return aboutUs;
}