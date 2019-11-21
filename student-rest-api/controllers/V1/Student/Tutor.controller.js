const tutorService = require('../../../services/V1/Student/Tutor.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { TOA_chat} = require('../../../models');

// Tutor list
module.exports.getTutorList = async function (req, res) {

    const branchId = req.user.branch.toJSON().id;

    [err, tutorList] = await to(tutorService.getTutorList(branchId));
    if (err) return ReE(res, err, 422);

    if (tutorList.length == 0) {

        return ReE(res, 'Tutor list is empty.', 204);

    } else {

        var singednTutorList = [];

        await Promise.all(tutorList.map(async (tutor) => {
            let tutorJson = tutor.toJSON();
            [err, count] = await to(TOA_chat.count({
                where : {
                  read : 0,
                  tutor_id : tutorJson.id,
                  chatRoom : 's'+req.user.id+'t'+tutorJson.id,
                  student_id : req.user.id,
                  [Op.or]: [{type: 'institute'}, {type: 'tutor'}]
                }
            }));
            tutorJson.unRead = count;

            tutorJson.image = await GetSignUrl(tutorJson.image);
            singednTutorList.push(tutorJson);
        }));

        return ReS(res, 'All tutor List Got Successfully.', singednTutorList);
    }
}