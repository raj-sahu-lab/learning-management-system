const feedbackService = require('../../../services/V1/Student_Enterprise/Feedback.service');
const { to, ReE, ReS } = require('../../../services/V1/util.service');

module.exports.saveFeedback = async function (req, res) {
    const body = req.fields
    if (!body.ratting) {

        return ReE(res, 'Please provide feedback ratting..', 422);
  
     } else if (!body.description) {
  
        return ReE(res, 'Please enter feedback description.', 422);

     }else{

        const feedbackJson = {

            student_id:req.user.id,
            ratting: body.ratting,
            description:body.description,
            create_ip: req.ip
        };
        
        [err, feedback] = await to(feedbackService.saveFeedback(feedbackJson));
        if (err) return ReE(res, err, 422);
        return ReS(res, 'Thank you for proving feedback.');
    }
}
