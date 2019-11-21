const superAdminService = require('../../../services/V1/Superadmin/superadmin.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const tutorService = require('../../../services/V1/Institute/tutor.service');

const { to, ReE, ReS } = require('../../../services/V1/util.service');
const sha1 = require('sha1');

const { v1 } = require('uuid');

// ---------------------------------------------- Topic ---------------------------------------------- 

// Add New Branch
module.exports.addBranch = async function (req, res) {

    const body = req.fields;

    if (!body.branchName) {

        return ReE(res, 'Please enter branch name.', 422);

    } if (!body.branchEmail) {

        return ReE(res, 'Please enter branch email.', 422);

    } else {

        [err, users] = await to(superAdminService.userExist(body.branchEmail));
        if (users) {

            return ReE(res, 'Email already exist. please use different email.', 422);
        }

        [err, users] = await to(branachService.userExist(body.branchEmail));
        if (users) {

            return ReE(res, 'Email already exist. please use different email.', 422);
        }

        [err, users] = await to(tutorService.userExist(body.branchEmail));
        if (users) {

            return ReE(res, 'User already exist.', 422);
        }

        const UUID = v1();
        const CODE = UUID.split("-")[0];

        let branchBody = {
            UUID: UUID,
            CODE: CODE,
            account_id: req.user.account_id,
            branch_manager: body.managerName,
            branch_name: body.branchName,
            contactCountryCode: body.contactCountryCode,
            branch_number: body.contactNumber,
            branch_email : body.branchEmail,
            password: sha1('12345'),//sha1(body.password),
            altcontactCountryCode: body.altcontactCountryCode,
            branch_altnumber: body.altContactNumber,
            branch_address: body.address,
            country_id: body.countryId ? body.countryId : null,
            city_id: body.cityId ? body.cityId : null,
            pincode: body.pincode,
            billingAddress: (body.billingAddress != null && body.billingAddress != '') ? body.billingAddress : null,
            panNumber: (body.panNumber != null && body.panNumber != '') ? body.panNumber : null,
            gstNumber: (body.gstNumber != null && body.gstNumber != '') ? body.gstNumber : null,
            branch_latitude: body.latitude,
            branch_longitude: body.longitude,
            create_ip: req.ip,
        };

        [err, branch] = await to(branachService.addBranch(branchBody));
        if (err) return ReE(res, err, 422);

        if (branch) {

            [err, branch] = await to(branachService.getBranch(req.user.account_id, branch.branch_id));
            return ReS(res, 'Branch added successfully.', branch);

        } else {

            return ReE(res, 'Failed to add branch, please try again.', 422);
        }
    }
}

// Get All Branches List
module.exports.getBranchList = async function (req, res) {


    [err, branchList] = await to(branachService.getBranchList(req.user.account_id, req.params.isFiltered));
    if (err) return ReE(res, err, 422);

    if (branchList.length == 0) {

        return ReE(res, 'Branch Not Available', 204);

    } else {

        return ReS(res, 'All Branch List Got Successfully.', branchList);
    }


}

// Update Branch
module.exports.updateBranch = async function (req, res) {

    const body = req.fields;
    if (!body.branchId) {

        return ReE(res, 'Branch id missing.', 422);

    } else if (!body.branchName) {

        return ReE(res, 'Please enter branch name.', 422);

    } else if (!body.branchEmail) {

        return ReE(res, 'Please enter branch email.', 422);

    } else {

        let branchBody = {

            account_id: req.user.account_id,
            branch_manager: body.managerName,
            branch_name: body.branchName,
            contactCountryCode: body.contactCountryCode ? body.contactCountryCode : null,
            branch_number: body.contactNumber,
            branch_email : body.branchEmail,
            altcontactCountryCode: body.altcontactCountryCode ? body.altcontactCountryCode : null,
            branch_altnumber: body.altContactNumber,
            branch_address: body.address,
            country_id: body.countryId ? body.countryId : null,
            city_id: body.cityId ? body.cityId : null,
            pincode: body.pincode,
            branch_latitude: body.latitude,
            branch_longitude: body.longitude,
            billingAddress: (body.billingAddress != null && body.billingAddress != '') ? body.billingAddress : null,
            panNumber: (body.panNumber != null && body.panNumber != '') ? body.panNumber : null,
            gstNumber: (body.gstNumber != null && body.gstNumber != '') ? body.gstNumber : null,
            update_ip: req.ip,
            status: body.status
        };

        if (body.password) {

            branchBody.password = sha1(body.password)
        }

        [err, branch] = await to(branachService.updateBranch(body.branchId, branchBody));
        if (err) return ReE(res, err, 422);

        if (branch.length === 1 && branch[0] == 1) {

            [err, branch] = await to(branachService.getBranch(req.user.account_id, body.branchId));
            return ReS(res, 'Branch updated successfully.', branch);

        } else {

            return ReE(res, 'Failed to update branch, please try again.', 422);
        }
    }
}

// Delete Branch
module.exports.deleteBranch = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Branch id missing.');

    } else {

        [err, branch] = await to(branachService.deleteBranch(req.user.account_id, req.params.id));
        if (err) return ReE(res, err, 422);

        if (branch.length === 1 && branch[0] == 1) {

            return ReS(res, 'Branch deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete branch. please try again.');
        }
    }
}

// ---------------------------------------------- Branch ---------------------------------------------- 