const { TOA_tutor } = require('../../../models');
const { to, TE } = require('../util.service');

// Get tutor list
module.exports.getTutorList = async function (branchId) {
    
    [err, tutorList] = await to(TOA_tutor.findAll({
        where: { delete: 0, status:0, branch_id: branchId},
        order: [['tutor_id','ASC']],
        attributes: [
            ['tutor_id', 'id'], ['tutor_name', 'name'], ['tutor_image', 'image']
        ]
    }));
    if (err) TE(err.message);
    return tutorList;
}