const { TOA_admission } = require('../../../models');
const { to, TE } = require('../util.service');


const getAdmissionList = async function (user) {

    [err, admissionList] = await to(TOA_admission.findAll({
        where: { account_id: user.account_id , admission_delete : 0 },
        order: [['admission_id', 'DESC']],
        attributes: ['admission_id', 'learner_id', 'course', 'course_type',['admission_status','status'],['admission_date','date'],['admission_time','time']],
        
    }));
    if (err) TE(err.message);
    return admissionList;
}
module.exports.getAdmissionList = getAdmissionList;