const { to, ReE, ReS } = require('../../../services/V1/util.service');
const reportService = require('../../../services/V1/Institute/report.service');


const getAllAdmission = async function (req, res) {

    [err, admisionList] = await to(reportService.getAdmissionList(req.user));
    if (err) return ReE(res, err, 422);
    return ReS(res, 'All Admission Get Successfully.', admisionList);

}
module.exports.getAllAdmission = getAllAdmission;