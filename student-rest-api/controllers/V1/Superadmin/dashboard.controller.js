const { to, ReE, ReS } = require('../../../services/V1/util.service');
const dashboardService = require("../../../services/V1/Superadmin/dashboard.service");

//Institute detils
module.exports.getInstituteCounts = async function (req, res) {
    [err, data] = await to(dashboardService.getInstituteCount());
    if (data.length == 0) {

        return ReE(res, 'No data Available', 200);
    }
    else {
        return ReS(res, 'All active Institute get successfully.', data);
    }
}

// SMS Details
module.exports.getSMSCounts = async function (req, res) {
    [err, smsCountDetail] = await to(dashboardService.getSMSCounts());
    if (err) return ReE(res, err, 422);

    if (smsCountDetail.length == 0) {

        return ReE(res, 'No data Available', 204);

    } else {

        return ReS(res, 'All SMS Details Got Successfully.', smsCountDetail);
    }

}

// Email Details
module.exports.getEmailCounts = async function (req, res) {

    [err, mailCountDetail] = await to(dashboardService.getEmailCounts());
    if (err) return ReE(res, err, 422);

    if (mailCountDetail.length == 0) {

        return ReE(res, 'No data Available', 200);

    } else {

        return ReS(res, 'All Email Details Got Successfully.', mailCountDetail);
    }

}

//getExpiredInstitutes
module.exports.getExpiredInstitutes = async function (req, res) {
    [err, expInstituteDetails] = await to(dashboardService.getExpiredInstitutes())
    if (err) return ReE(res, err, 422)

    if (expInstituteDetails.length == 0) {

        return ReE(res, 'No data Available', 204);

    } else {

        return ReS(res, 'All Institute Details Got Successfully.', expInstituteDetails);
    }
}

//getExpiredInstitutesInWeek
module.exports.getExpiredInstitutesInWeek = async function (req, res) {
    [err, getExpiredInstitutesInWeek] = await to(dashboardService.getExpiredInstitutesInWeek())

    if (err) return ReE(res, err, 422)

    if (getExpiredInstitutesInWeek.length == 0) {
        return ReE(res, 'No data Available', 204)
    } else {
        return ReS(res, 'All Institute Details Got Successfully.', getExpiredInstitutesInWeek)
    }
}

//getTotalRegistredStudents
module.exports.getTotalRegistredStudents = async function (req, res) {

    const body = req.fields;

    if (!body.year) {

        return ReE(res, 'Please enter year.', 422);

    } else {
        let yearBody = body;
        [err, getTotalRegistredStudents] = await to(dashboardService.getTotalRegistredStudents(yearBody.year))

        if (err) return ReE(res, err, 422)

        if (getTotalRegistredStudents.length == 0) {
            return ReE(res, 'No data Available', 204)
        } else {
            return ReS(res, 'All Institute Details Got Successfully.', getTotalRegistredStudents)
        }
    }
}

//getTotalStudentIncome
module.exports.getTotalStudentIncome = async function (req, res) {

    const body = req.fields;

    if (!body.year) {

        return ReE(res, 'Please enter year.', 422);

    } else if (!body.currency) {

        return ReE(res, 'Please enter currency.', 422);

    } else {
        let yearBody = body;

        [err, getTotalStudentIncome] = await to(dashboardService.getTotalStudentIncome(yearBody.year, yearBody.currency))

        if (err) return ReE(res, err, 422)

        if (getTotalStudentIncome.length == 0) {
            return ReE(res, 'No data Available', 204)
        } else {
            return ReS(res, 'All Institute Details Got Successfully.', getTotalStudentIncome)
        }
    }
}

//getTotalInstitutePurchase
module.exports.getTotalInstitutePurchase = async function (req, res) {

    const body = req.fields;

    if (!body.year) {

        return ReE(res, 'Please enter year.', 422);

    } else if (!body.currency) {

        return ReE(res, 'Please enter currency.', 422);

    } else {
        let yearBody = body;

        [err, getTotalInstitutePurchase] = await to(dashboardService.getTotalInstitutePurchase(yearBody.year, yearBody.currency))

        if (err) return ReE(res, err, 422)

        if (getTotalInstitutePurchase.length == 0) {
            return ReE(res, 'No data Available', 204)
        } else {
            return ReS(res, 'All Institute Details Got Successfully.', getTotalInstitutePurchase)
        }
    }
}