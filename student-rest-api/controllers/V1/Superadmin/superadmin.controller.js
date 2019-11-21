const superAdminService = require('../../../services/V1/Superadmin/superadmin.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const tutorService = require('../../../services/V1/Institute/tutor.service');
const planService = require('../../../services/V1/Superadmin/plan.service');
const authInstituteService = require('../../../services/V1/Institute/auth.service');
const CONFIG = require('../../../config/config');
const { v1 } = require('uuid');
const { createSubDomain } = require('../../../services/V1/createsubdomain.service');

const { to, ReE, ReS, UploadImage, GetSignUrl, RegisterInstituteInSIB, InstituteFolderInSIB, SendInstituteRegisterEMail, SendMailUsingTOA } = require('../../../services/V1/util.service');
const sha1 = require('sha1');
const fs = require('fs');



const createAdmin = async function (req, res) {

    const body = req.fields;

    if (body.title && body.phone && body.email && body.password && req.files.image) {

        var imageBuffer = fs.readFileSync(req.files.image.path);
        var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        [err, s3Bucket] = await to(UploadImage('Admin', name, imageBuffer));
        if (err) return ReE(res, 'Failed to create user. please try gain.', 422);


        let userInfo = {

            image: s3Bucket.Key,
            title: body.title,
            phone: body.phone,
            email: body.email,
            password: sha1(body.password),
            role: 1,
            create_ip: req.ip,
        };

        [err, user] = await to(superAdminService.createAdmin(userInfo));
        if (err) return ReE(res, err, 422);

        if (user) {

            let userJSON = user.toJSON();
            userJSON.image = await GetSignUrl(userJSON.image);
            delete userJSON.password;
            delete userJSON.status;
            delete userJSON.delete;
            delete userJSON.create_ip;

            return ReS(res, 'Admin User creared successfully.', userJSON);

        } else {

            return ReE(res, 'Failed to create admin user. please try again.', 422);
        }
    }
    else {

        return ReE(res, 'Please Enter Required field', 422);
    }

}
module.exports.createAdmin = createAdmin;


// Create New User
module.exports.addNewInstitute = async function (req, res) {

    const body = req.fields;

    if (!body.title) {

        return ReE(res, 'Please enter institute name.', 422);

    } else if (!body.email) {

        return ReE(res, 'Please enter email id.', 422);

    } else if (!body.password) {

        return ReE(res, 'Please enter password.', 422);

    } else if (!body.domain) {

        return ReE(res, 'Please enter domain.', 422);

    } else {
        //Check user exist or not
        [err, users] = await to(superAdminService.userExist(body.email));
        if (users) { return ReE(res, 'Email already exist. please use different email.', 422); }


        // Checkout domain exist or not
        [err, users] = await to(superAdminService.domainExist(body.domain));
        if (users) { return ReE(res, 'Domain already exist. please try to login.', 422); }
        

        // Checkout domain exist or not
        [err, users] = await to(superAdminService.domainExist(body.domain));
        if (users) { return ReE(res, 'Domain already exist. please try to login.', 422); }

        // [err, users] = await to(branachService.userExist(body.email));
        // if (users) { return ReE(res, 'Email already exist. please use different email.', 422); }

        [err, users] = await to(tutorService.userExist(body.email));
        if (users) { return ReE(res, 'Email already exist. please use different email.', 422); }

        var isMarketplaceEnable = true;
        if (body.isMarketplaceEnable != null) { isMarketplaceEnable = body.isMarketplaceEnable; }

        var accessLevel = 2;
        if (body.accessLevel) { accessLevel = body.accessLevel; }

        // [err, ins] = await to(RegisterInstituteInSIB(body.email, body.title));
        // if (err) return ReE(res, 'Failed to add institute. please try again', 422);

        // [err, folder] = await to(InstituteFolderInSIB(body.title));
        // if (err) return ReE(res, 'Failed to add institute. please try again', 422);

        var imageBuffer = fs.readFileSync(CONFIG.STATCI_FILES + '/ic_platform_logo.png');
        var name = (new Date().getTime().toString()) + '_' + 'ic_platform_logo.png';
        if (req.files.image != null) {
            var imageBuffer = fs.readFileSync(req.files.image.path);
            var name = (new Date().getTime().toString()) + '_' + req.files.image.name;
        }

        [err, s3Bucket] = await to(UploadImage('user', name, imageBuffer));
        if (err) return ReE(res, 'Failed to create user. please try gain.', 422);

        const UUID = v1();
        const CODE = UUID.split("-")[0];


        let userInfo = {
            UUID: UUID,
            CODE: CODE,
            account_image: s3Bucket.Key,
            account_title: body.title,
            countryCode: body.countryCode,
            country_id: body.countryId,
            currency_id: body.currencyId,
            city_id: body.cityId,
            pin_code: body.pinCode,
            account_phone: body.phone,
            account_email: body.email,
            account_password: sha1(body.password),
            account_domain: !body.domain ? '' : body.domain,
            account_apikey: 'AAAANtS12RA:APA91bGJmyxc1fiIJZFY8c2eMoFKyBBGKoLNCmzwqWWoxzRKVQfNVG-Et1DhkljdOvmt7eO2ciToxYlRxLWqaL9jxzfPmpe5dgR6CibiNufbjXWwUWWBFpVjForLJ6-ZC4ejPK-_gubs',
            // sib_folder_id: folder.id,
            is_marketplace_enable: isMarketplaceEnable,
            accessLevel: accessLevel,
            create_ip: req.ip,
        };

        [err, user] = await to(superAdminService.createUser(userInfo));
        if (err) return ReE(res, err, 422);

        [err, response] = await to(createSubDomain(userInfo.account_title,userInfo.account_domain));
        let branchBody = {
            UUID: UUID,
            CODE: CODE,
            account_id: user.account_id,
            branch_name: body.title,
            contactCountryCode: body.countryCode,
            branch_number: body.phone,
            branch_email: body.email,
            password: sha1('12345'),//sha1(body.password),
            branch_address: body.title,
            country_id: body.countryId,
            city_id: body.cityId,
            pincode: body.pinCode,
            billingAddress: (body.billingAddress != null && body.billingAddress != '') ? body.billingAddress : null,
            panNumber: (body.panNumber != null && body.panNumber != '') ? body.panNumber : null,
            gstNumber: (body.gstNumber != null && body.gstNumber != '') ? body.gstNumber : null,
            branch_latitude: body.latitude,
            branch_longitude: body.longitude,
            create_ip: req.ip,
        };

        [err, branch] = await to(branachService.addBranch(branchBody));

        if (user) {

            [err, info] = await to(SendInstituteRegisterEMail(body.email, body.title));
            if (err) return ReE(res, err, 422);

            [err, user] = await to(superAdminService.getAInstitute(user.account_id));
            if (err) return ReE(res, err, 422);

            let res_user = user.toWeb();
            res_user.account_image = await GetSignUrl(res_user.account_image);
            delete res_user.account_password;


            [err, plan] = await to(planService.getPlan(7));
            if (plan) {

                let planObj = plan.toJSON();
                [err, term] = await to(planService.getTerm(3));
                if (term) {

                    let termObj = term.toWeb();
                    const planStartDate = new Date();
                    var planEndDate = new Date();
                    planEndDate.setTime(planEndDate.getTime() + termObj.days * 86400000);

                    var planPurchase = {

                        account_id: res_user.account_id,
                        term_id: 3,
                        plan_id: 7,
                        plan_gst: 0,
                        transaction_id: 'Free trial',
                        plan_title: planObj.title,
                        plan_amount: planObj.amount,
                        currencyType: 1,
                        plan_sdate: planStartDate,
                        plan_edate: planEndDate,
                        create_ip: req.ip
                    };

                    [err, purchasedPlan] = await to(authInstituteService.addNewPlan(planPurchase));
                    if (purchasedPlan) {

                        if (planObj.subject_title && planObj.mail_content) {

                            [err, info] = await to(SendMailUsingTOA(req.user.account_title, req.user.account_email, planObj.subject_title, planObj.mail_content));
                        }
                    }
                }
            }
            return ReS(res, 'Institute created successfully.', res_user);
        }
        else {

            return ReS(res, 'Failed to create institute.please try again.');
        }
    }
}


module.exports.updateUUID = async function (req, res) {

    return ReE(res, 'Thanks For Calling , you are at wrong place.', 422);
    // [err, users] = await to(superAdminService.getAllUserBranchesList());
    // if (err) return ReE(res, err, 422);
    // if (users.length == 0) {

    //     return ReE(res, 'All users get successfully.', 204);

    // } else {

    //     var userSignedList = [];

    //     await Promise.all(users.map(async (user) => {

    //         var user = user.toJSON();

    //         const UUID = v1();
    //         const CODE = UUID.split("-")[0];

    //         let userInfo = {
    //             UUID: UUID,
    //             CODE: CODE
    //         };
    //         [err, userRes] = await to(superAdminService.updateUserBranches(user.branch_id, userInfo));
    //         if (err) return ReE(res, err, 422);

    //         userSignedList.push(user)

    //     }));

    //     return ReS(res, 'All users get successfully.', userSignedList);
    // }


    // for account
    // [err, users] = await to(superAdminService.getAllUserList());
    // if (err) return ReE(res, err, 422);
    // if (users.length == 0) {

    //     return ReE(res, 'All users get successfully.', 204);

    // } else {

    //     var userSignedList = [];

    //     await Promise.all(users.map(async (user) => {

    //         var user = user.toJSON();

    //         const UUID = v1();
    //         const CODE = UUID.split("-")[0];

    //         let userInfo = {
    //             UUID: UUID,
    //             CODE: CODE
    //         };
    //         [err, userRes] = await to(superAdminService.updateUser(user.account_id, userInfo));
    //         if (err) return ReE(res, err, 422);

    //         userSignedList.push(user)

    //     }));

    //     return ReS(res, 'All users get successfully.', userSignedList);
    // }
}


const editInstitute = async function (req, res) {

    const body = req.fields;

    if (body) {

        const userInfo = {
            update_ip: req.ip,
            status: body.status
        };

        [err, userRes] = await to(superAdminService.updateUser(body.accountId, userInfo));
        if (err) return ReE(res, err, 422);

        if (userRes.length == 1 && userRes[0] == 1) {

            [err, user] = await to(superAdminService.getAInstitute(body.accountId));
            if (err) return ReE(res, err, 422);
            if (user) {

                var user = user;
                user.account_image = await GetSignUrl(user.account_image);
                return ReS(res, 'Institute updated successfully.', user);

            } else {

                return ReE(res, 'Failed to update institute. please try again', 422);

            }
        } else {

            return ReE(res, 'Failed to update institute. please try again', 422);
        }
    }
    else {

        return ReE(res, 'Please Enter Required field', 422);
    }

}
module.exports.editInstitute = editInstitute;



const getAdmin = async function (req, res) {

    const body = req.fields;
    let err, user;

    [err, user] = await to(superAdminService.authUser(body));
    if (err) return ReE(res, err, 422);

    let res_user = user.toWeb();
    res_user.bearer_token = user.getJWT();
    res_user.password = null;
    res_user.image = await GetSignUrl(res_user.image);

    return ReS(res, 'Login successfully.', res_user);
}
module.exports.getAdmin = getAdmin;


const getAllUsers = async function (req, res) {

    [err, users] = await to(superAdminService.getAllUserList());
    if (err) return ReE(res, err, 422);
    if (users.length == 0) {

        return ReE(res, 'All users get successfully.', 204);

    } else {

        var userSignedList = [];

        for (let index = 0; index < users.length; index++) {

            let user = users[index].toJSON();
            user.account_image = await GetSignUrl(user.account_image);

            [err, plan] = await to(superAdminService.getInstituteLastPurchasedPlan(user.account_id));
            if (err) return ReE(res, err, 422);
            user.currentPlan = plan ? plan : null;

            userSignedList.push(user)
        }

        return ReS(res, 'All users get successfully.', userSignedList);
    }
}
module.exports.getAllUsers = getAllUsers;


module.exports.chnagePassword = async function (req, res) {

    const body = req.fields;
    if (!body.password) {

        return ReE(res, 'Please Enter Current password', 422);

    } else if (!body.newPassword) {

        return ReE(res, 'Please Enter New password', 422);

    } else {

        [err, user] = await to(superAdminService.getAccount(req.user.id));
        if (err) return ReE(res, err, 422);
        if (user) {

            if (sha1(body.password) == user.password) {

                const userInfo = {

                    password: sha1(body.newPassword),
                    update_ip: req.ip
                };

                [err, userRes] = await to(superAdminService.updateAccount(req.user.id, userInfo));
                if (err) return ReE(res, err, 422);

                if (userRes.length == 1 && userRes[0] == 1) {

                    return ReS(res, 'Password updated successfully.', null);
                } else {

                    return ReE(res, 'Failed to update password, please try again.', 422);
                }

            } else {

                return ReE(res, 'Your old password mismatch.', 422);
            }
        } else {

            return ReE(res, 'User not found.', 422);
        }
    }
}


module.exports.enableDisableUltimateLink = async function (req, res) {

    const body = req.fields;

    let isEnabled = body.isEnabled;
    var accessToken = null;

    if (isEnabled) {

        const UUID = v1();
        accessToken = UUID;

    }

    const userInfo = {
        accessToken: accessToken,
        update_ip: req.ip,
    };

    [err, userRes] = await to(superAdminService.updateUser(body.accountId, userInfo));
    if (err) return ReE(res, err, 422);

    if (userRes.length == 1 && userRes[0] == 1) {

        [err, user] = await to(superAdminService.getAInstitute(body.accountId));
        if (err) return ReE(res, err, 422);
        if (user) {

            var user = user;
            user.account_image = await GetSignUrl(user.account_image);
            return ReS(res, 'Updated successfully.', user);

        } else {

            return ReE(res, 'Failed to generate access token . please try again', 422);

        }
    } else {

        return ReE(res, 'Failed to generate access token . please try again', 422);
    }
}



//Add email template

module.exports.addEmailTemplate = async function (req, res) {

    const body = req.fields;

    if (!body.email_title) {

        return ReE(res, 'Please enter email title', 422);

    } else if (!body.email_subject) {

        return ReE(res, 'Please enter email subject', 422);

    } else if (!body.email_body) {

        return ReE(res, 'Please enter email body', 422);

    } else {

        var email_template = {
            email_title: body.email_title,
            email_subject: body.email_subject,
            email_body: body.email_body,
            create_ip: req.ip
        };

        [err, emailTemplate] = await to(superAdminService.createEmailTemplate(email_template));
        if (err) return ReE(res, err, 422);
        if (emailTemplate) {
            var emailTemplate = emailTemplate;
            return ReS(res, 'Created successfully.', emailTemplate);
        } else {
            return ReE(res, 'Failed to create email template . please try again', 422);
        }
    }

}

//Edit email template

module.exports.editEmailTemplate = async function (req, res) {

    const body = req.fields;

    if (!body.id) {

        return ReE(res, 'Please enter id', 422);

    } else {
        [err, template] = await to(superAdminService.getEmailTemplate(body.id));
        if (err) return ReE(res, err, 422);

        if (template) {

            const templateInfo = {
                update_ip: req.ip
            };

            if (body.email_title) {
                templateInfo.email_title = body.email_title
            }

            if (body.email_subject) {
                templateInfo.email_subject = body.email_subject
            }

            if (body.email_title) {
                templateInfo.email_body = body.email_body
            }

            var tempId = template.id;

            [err, templateRes] = await to(superAdminService.updateEmailTemplate(tempId, templateInfo));
            if (err) return ReE(res, err, 422);

            if (templateRes.length == 1 && templateRes[0] == 1) {

                [err, updatedTemplate] = await to(superAdminService.getEmailTemplate(tempId));
                if (err) return ReE(res, err, 422);
                
                if (updatedTemplate) {
                    return ReS(res, 'Template updated successfully.', updatedTemplate);
                } else {
                    return ReE(res, 'Failed to update template. please try again', 422);
                }
            } else {
                return ReE(res, 'Failed to update template, please try again.', 422);
            }
        } else {
            return ReE(res, 'Template not found.', 422);
        }
    }

}

// Get Templates 
module.exports.getTemplateList = async function (req, res) {

    [err, templateList] = await to(superAdminService.getAllEmailTemplates());
    if (err) return ReE(res, err, 422);
    if (templateList.length == 0) {
        return ReE(res, 'Templates Not Available.', 204);
    }
    else {
        return ReS(res, 'Templates List Get Successfully.', templateList, 200);
    }

};



// Get Template by id
module.exports.getTemplateById = async function (req, res) {
    let id = req.params.id;

    if (!id) {
        return ReE(res, 'Please enter id', 422);
    } else {
        [err, template] = await to(superAdminService.getEmailTemplate(id));
        if (err) return ReE(res, err, 422);
        if (template.length == 0) {
            return ReE(res, 'Template Not Available.', 204);
        }
        else {
            return ReS(res, 'Template Get Successfully.', template, 200);
        }
    }
};