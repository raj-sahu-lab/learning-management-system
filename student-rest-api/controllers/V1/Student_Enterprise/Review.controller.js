const reviewService = require('../../../services/V1/Student_Enterprise/Review.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

module.exports.addReview = async function (req, res) {

    const body = req.fields;

    if (!body.type) {

        return ReE(res, 'Please provide review type.', 422);

    } else if (!body.id) {

        return ReE(res, 'Please provide id.', 422);

    } else if (!body.ratting) {

        return ReE(res, 'Please provide ratting.', 422);

    } else if (!body.review) {

        return ReE(res, 'Please write review.', 422);

    } else {

        const reviewJson = {

            student_id: req.user.id,
            type: body.type,
            typeId: body.id,
            rating: body.ratting,
            review: body.review,
            create_ip: req.ip,
        };

        [err, review] = await to(reviewService.addReview(reviewJson));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Thank you for providing review.');
    }
}

module.exports.reviewList = async function (req, res) {

    [err, reviewList] = await to(reviewService.reviewList(req.user.id));
    if (err) return ReE(res, err, 422);

    if (reviewList.length == 0) {

        return ReS(res, 'Review List empty.', [], 204);

    } else {

        return ReS(res, 'Review list get successfully.', reviewList);
    }
}


module.exports.getAboutUs = async function (req, res) {


    [err, aboutUs] = await to(reviewService.getAboutUs(req.user.id));
    if (err) return ReE(res, err, 422);
        
    return ReS(res, 'About us got successfully.', aboutUs.branch.account.aboutUs);
}

module.exports.getPrivacyPolices = async function (req, res) {
    
    [err, privacyPolices] = await to(reviewService.getPrivacyPolices(req.user.id));
    if (err) return ReE(res, err, 422);
    return ReS(res, 'Privacy polices got successfully.', privacyPolices.branch.account.privacyPolicy);
}