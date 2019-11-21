const reviewService = require('../../../services/V1/Institute/review.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

module.exports.reviewList = async function (req, res) {

    [err, reviewList] = await to(reviewService.reviewList(req.user.account_id));
    if (err) return ReE(res, err, 422);

    if (reviewList.length == 0) {

        return ReS(res, 'Review List empty.', [], 204);

    } else {
        // return ReS(res, 'Review list get successfully.', reviewList);
        var reviewListArray = [];

        await Promise.all(reviewList.map(async (review) => {

            var reviewJson = review.toJSON();

            if(reviewJson.type == 1){
                [err, details] = await to(reviewService.getSubject(reviewJson.typeId));
                if (err) return ReE(res, err, 422);
                if(details){
                    
                    // delete details.account; // Remove from response
                    
                    reviewJson.detail = details;
                }
            }
            
            reviewListArray.push(reviewJson);
        }));

        return ReS(res, 'Review list get successfully.', reviewListArray);
    }
}
