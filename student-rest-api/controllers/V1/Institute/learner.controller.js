const learnerService = require('../../../services/V1/Institute/learner.service');
const authService = require('../../../services/V1/Student/authentication.service');
const smsService = require('../../../services/V1/Superadmin/sms.service');
const emailService = require('../../../services/V1/Superadmin/email.service');
const branachService = require('../../../services/V1/Institute/branch.service');
const educationService = require('../../../services/V1/Superadmin/Education.service');

const { to, ReE, ReS, GetSignUrl, RegisterForMailing, SendStudentEMailInstituteAdd } = require('../../../services/V1/util.service');
const sha1 = require('sha1');
const XLSX = require('xlsx');
const CONFIG = require('../../../config/config');

// Add New Learner
module.exports.addLearner = async function (req, res) {


    const body = req.fields;
    if (!body.branchId && req.user.userType != 3) {

        return ReE(res, 'Please select branch.', 422);

    } else if (!body.countryCode) {

        return ReE(res, 'Please enter country code.', 422);

    } else if (!body.phone) {

        return ReE(res, 'Please enter phone number.', 422);

    } else if (!body.firstName) {

        return ReE(res, 'Please enter first name.', 422);

    } else if (!body.password) {

        return ReE(res, 'Please enter password.', 422);

    } else {

        [err, user] = await to(authService.studentExistbyPhone(body.phone));
        if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

        if (user) {

            return ReE(res, 'Phone already exist.', 422);

        } else {

            var sendInBlueId = null;
            if (body.email) {

                [err, result] = await to(RegisterForMailing(body.email, body.firstName, ''));
                if (result) {
                    sendInBlueId = result.id;
                }
            }

            const studentJson = {

                first_name: body.firstName,
                last_name: body.lastName,
                countrycode: body.countryCode,
                phone: body.phone,
                education_type_id: body.educationType ? body.educationType : null,
                password: sha1(body.password),
                email: body.email,
                sendInBlue_id: sendInBlueId,
                create_ip: req.ip,
                verified : 1
            };

            [err, student] = await to(authService.deleteStudentFromTemp(body.phone));

            [err, student] = await to(authService.registerStudent(studentJson));
            if (err) return ReE(res, err, 422);

            if (body.email) {
                let emailData = {
                    email : body.email,
                    userName : body.firstName + ' ' + body.lastName,
                    phone : body.phone,
                    password : body.password,
                    url: CONFIG.Student_Panel+'verify/'+student.id,
                    logo : req.user.account_image? await GetSignUrl(req.user.account_image) : 'https://img.mailinblue.com/2598720/images/rnb/original/5e47eadb9967ccbc76710418.png',
                    code : req.user.CODE,
                    instituteName : req.user.account_title
                }

                await to(SendStudentEMailInstituteAdd(emailData));
            }

            // Adding Institute as subscribed institute 
            var arrInstituteList = [];
            var branchId = null;
            if (req.user.userType == 3) { branchId = req.user.branch.id; } else { branchId = body.branchId; }
            await Promise.all([branchId].map(async (instituteId) => {

                [err, ins] = await to(authService.studentAlreadyInInstitute(instituteId, req.user.id));
                if (ins == null) {

                    const instituteJson = {

                        student_id: student.id,
                        branch_id: instituteId,
                        create_ip: req.ip
                    };
                    arrInstituteList.push(instituteJson)
                }
            }));

            [err, instituteList] = await to(authService.addInstitutes(arrInstituteList));
            if (err) return ReE(res, err, 422);

            // Assigning default institute as per the adding one
            const studentInfo = { defaultBranch: branchId };
            [err, user] = await to(authService.updateStudent(student.id, studentInfo));
            if (err) return ReE(res, err, 422);


            // Getting Student Json from database and returning
            [err, user] = await to(authService.getStudent(student.id));
            if (err) return ReE(res, err, 422);

            let res_user = user.toWeb();

            if (res_user.image) {

                res_user.image = await GetSignUrl(res_user.image);
            }

            return ReS(res, 'Register successfully.', res_user);
        }
    }
}


module.exports.activeDeactiveLearner = async function (req, res) {

    const body = req.fields;
    if (!body.branchId && req.user.userType != 3) {

        return ReE(res, 'Please select branch.', 422);

    } else if (!body.learnerId) {

        return ReE(res, 'Please select learner.', 422);

    } else if (body.isActive == null) {

        return ReE(res, 'Please select learner status.', 422);

    } else {

        var branchId = null;
        if (req.user.userType == 3) { branchId = req.user.branch.id; } else { branchId = body.branchId; }

        const studentJson = { isActive: body.isActive };

        [err, learner] = await to(learnerService.updateLearnerBranchStatus(branchId, body.learnerId, studentJson));
        if (err) return ReE(res, err, 422);
        
        if(learner.length == 1 && learner[0] == 1){

            return ReS(res, 'Updated successfully.');

        } else {
            return ReE(res, 'Failed to update. please try again.', 422);
        }
    }
}
//Get All Learner List
module.exports.getLearnerList = async function (req, res) {

    if (req.params.isFiltered == 1) {
        // To get mobile number list

        [err, learnerList] = await to(learnerService.getLearnerMobileList(req.user.account_id));
        if (err) return ReE(res, err, 422);

        var totalSMS = 0;
        [err, smsStatus] = await to(smsService.getInstituteRemainSMSStatus(req.user.account_id));
        if (err) return ReE(res, err, 422);

        if (smsStatus.toJSON().total_sms) {

            totalSMS = smsStatus.toJSON().total_sms;
        }

        [err, smsSentStatus] = await to(smsService.getInstituteSentSMSStatus(req.user.account_id));
        if (err) return ReE(res, err, 422);

        var totalSentSMS = 0;
        if (smsSentStatus.length > 0) {

            await Promise.all(smsSentStatus.map(async (smsObj) => {

                var smsObj = smsObj.toJSON();
                totalSentSMS = totalSentSMS + (smsObj.sent_contacts.split(',').length * smsObj.sms_length);
            }));
        }

        // if (smsSentStatus.toJSON().sent_contacts) {
        // totalSentSMS = smsSentStatus.toJSON().sent_contacts.split(',').length;
        // }

        let responseJSON = {

            totalSMS: totalSMS,
            totalSentSMS: totalSentSMS,
            remainSMS: totalSMS - totalSentSMS
        };

        if (learnerList.length == 0) {

            return ReE(res, 'Learner list not available.', 204, responseJSON);

        } else {

            var learnerSignedList = [];

            await Promise.all(learnerList.map(async (learner) => {

                var learner = learner.toJSON();
                // if (learner.instituteList.length != 0) {

                //     delete learner.instituteList;
                //     learnerSignedList.push(learner);
                // }

                if (learner.instituteList) {

                    delete learner.instituteList;
                    learnerSignedList.push(learner);
                }
            }));

            responseJSON.learnerList = learnerSignedList;
            return ReS(res, 'All Learner List Got Successfully.', responseJSON);
        }

    } else if (req.params.isFiltered == 2) {
        // To get all email list

        [err, learnerList] = await to(learnerService.getLearnerEmailList(req.user.account_id));
        if (err) return ReE(res, err, 422);

        var totalEmail = 0;
        [err, emailStatus] = await to(emailService.getInstituteRemainEmailStatus(req.user.account_id));
        if (err) return ReE(res, err, 422);

        if (emailStatus.toJSON().totalEmail) {

            totalEmail = emailStatus.toJSON().totalEmail;
        }

        [err, emailSentStatus] = await to(emailService.getInstituteSentEmailStatus(req.user.account_id));
        if (err) return ReE(res, err, 422);

        var totalSentEmail = 0;
        if (emailSentStatus.toJSON().sentEmails) {

            totalSentEmail = emailSentStatus.toJSON().sentEmails.split(',').length;
        }

        let responseJSON = {

            totalMails: totalEmail,
            totalSentMails: totalSentEmail,
            remainMails: totalEmail - totalSentEmail
        };

        if (learnerList.length == 0) {

            return ReE(res, 'Learner list not available.', 204, responseJSON);

        } else {

            var learnerSignedList = [];

            await Promise.all(learnerList.map(async (learner) => {

                var learner = learner.toJSON();
                // if (learner.instituteList.length != 0) {

                //     delete learner.instituteList;
                //     learnerSignedList.push(learner);
                // }

                if (learner.instituteList) {

                    delete learner.instituteList;
                    learnerSignedList.push(learner);
                }
            }));

            responseJSON.learnerList = learnerSignedList;
            return ReS(res, 'All Learner List Got Successfully.', responseJSON);
        }

    } else if (req.params.isFiltered == 3) {


        // All Non purchase Subjects user list
        const purchaseType = req.params.purchaseType;
        const purchaseId = req.params.purchaseId;

        if (purchaseType == null) {

            return ReE(res, 'Please select type', 422);

        } else if (purchaseId == null) {

            return ReE(res, 'Please select cource', 422);
        } else {

            [err, learnerList] = await to(learnerService.getLearnerListOfNonPurchased(req.user.account_id, purchaseType, purchaseId));
            if (err) return ReE(res, err, 422);

            if (learnerList.length == 0) {

                return ReE(res, 'Learner list not available.', 204);

            } else {

                var learnerSignedList = [];

                await Promise.all(learnerList.map(async (learner) => {

                    var learner = learner.toJSON();
                    learner.image = await GetSignUrl(learner.image);

                    delete learner.instituteList;

                    learnerSignedList.push(learner);
                }));

                return ReS(res, 'All Learner List Got Successfully.', learnerSignedList);
            }
        }


    }else if (req.params.isFiltered == 4) {


        // All Non purchase Subjects user list
        const purchaseType = req.params.purchaseType;
        const purchaseId = req.params.purchaseId;

        if (purchaseType == null) {

            return ReE(res, 'Please select type', 422);

        } else if (purchaseId == null) {

            return ReE(res, 'Please select cource', 422);
        } else {

            [err, learnerList] = await to(learnerService.getLearnerListOfPurchased(req.user.account_id, purchaseType, purchaseId));
            if (err) return ReE(res, err, 422);

            if (learnerList.length == 0) {

                return ReE(res, 'Learner list not available.', 204);

            } else {

                var learnerSignedList = [];

                await Promise.all(learnerList.map(async (learner) => {

                    var learner = learner.toJSON();
                    learner.image = await GetSignUrl(learner.image);

                    delete learner.instituteList;

                    learnerSignedList.push(learner);
                }));

                return ReS(res, 'All Learner List Got Successfully.', learnerSignedList);
            }
        }


    } else {

        let branchId = null;
        if (req.user.userType == 3) { branchId = req.user.branch.id; }
        [err, learnerList] = await to(learnerService.getLearnerList(req.user.account_id, branchId));
        if (err) return ReE(res, err, 422);

        if (learnerList.length == 0) {

            return ReE(res, 'Learner list not available.', 204);

        } else {

            var learnerSignedList = [];

            await Promise.all(learnerList.map(async (learner) => {

                var learner = learner.toJSON();
                if (learner.instituteList) {

                    learner.image = await GetSignUrl(learner.image);
                    learnerSignedList.push(learner);
                }
                // if (learner.instituteList.length != 0) {

                //     learner.image = await GetSignUrl(learner.image);
                //     learnerSignedList.push(learner);
                // }
            }));

            return ReS(res, 'All Learner List Got Successfully.', learnerSignedList);
        }
    }
}

// Update Existing Learner
const updateLearner = async function (req, res) {

    const body = req.fields;
    if (!body.learnerId) {

        return ReE(res, 'Please select learner.', 422);

    } else if (!body.countryCode) {

        return ReE(res, 'Please enter country code.', 422);

    } else if (!body.phone) {

        return ReE(res, 'Please enter phone number.', 422);

    } else if (!body.firstName) {

        return ReE(res, 'Please enter first name.', 422);

    } else {

        var studentJson = {

            first_name: body.firstName,
            last_name: body.lastName,
            countrycode: body.countryCode,
            phone: body.phone,
            education_type_id: body.educationType ? body.educationType : null,
            email: body.email,
            create_ip: req.ip
        };

        if (body.password) {

            studentJson.password = sha1(body.password)
        }

        [err, learnerList] = await to(learnerService.updateLearner(body.learnerId, studentJson));
        if (err) return ReE(res, err, 422);

        // Getting Student Json from database and returning
        [err, user] = await to(authService.getStudent(body.learnerId));
        if (err) return ReE(res, err, 422);

        let res_user = user.toWeb();

        if (res_user.image) {

            res_user.image = await GetSignUrl(res_user.image);
        }

        return ReS(res, 'Student updated successfully.', res_user);
    }
}
module.exports.updateLearner = updateLearner;

// Delete Learner
module.exports.deleteLearner = async function (req, res) {

    if (!req.params.id) {

        return ReE(res, 'Learner id missing.');

    } else {

        [err, isSuccess] = await to(learnerService.deleteLearner(req.params.id));
        if (err) return ReE(res, err, 422);
        if (isSuccess.length == 1 && isSuccess[0] == 1) {

            return ReS(res, 'Learner Deleted successfully.');

        } else {

            return ReE(res, 'Failed to delete learner. please try again.');
        }
    }
}

module.exports.bulkStudnetAdd = async function (req, res) {

    if (req.files.excelFile) {

        var workbook = XLSX.readFile(req.files.excelFile.path);
        var sheet_name_list = workbook.SheetNames;

        if (sheet_name_list.length > 0) {

            let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            var errorStudents = [];
            var successStudents = [];

            await Promise.all(data.map(async (student) => {

                if (student.BranchName) {

                    //Get Branch
                    [err, branch] = await to(branachService.getBranchByName(req.user.account_id, student.BranchName));
                    if (branch) {

                        if (student.Education) {
                            
                            //Get Education
                            [err, education] = await to(educationService.getEducationByName(student.Education));
                            if (education) {

                                if (student.FirstName) {

                                    if (student.CountryCode && student.MobileNumber) {

                                        [err, user] = await to(authService.studentExistbyPhone(student.MobileNumber));
                                        if (user == null) {

                                            var sendInBlueId = null;
                                            if (student.Email) {

                                                [err, result] = await to(RegisterForMailing(student.Email, student.FirstName, student.LastName));
                                                if (result) {
                                                    sendInBlueId = result.id;
                                                }
                                            }

                                            const studentJson = {

                                                first_name: student.FirstName,
                                                last_name: student.LastName,
                                                countrycode: student.CountryCode,
                                                phone: student.MobileNumber,
                                                education_type_id: education.id,
                                                password: student.Password ? sha1(student.Password) : sha1('[PASSWORD]'),
                                                email: student.Email,
                                                defaultBranch: branch.toJSON().id,
                                                sendInBlue_id: sendInBlueId,
                                                create_ip: req.ip
                                            };

                                            [err, student] = await to(authService.deleteStudentFromTemp(student.MobileNumber));

                                            [err, student] = await to(authService.registerStudent(studentJson));

                                            if (err != null) {

                                                var studentEdit = student;
                                                studentEdit.error = 'Failed to add student';
                                                errorStudents.push(studentEdit);
                                            } else {

                                                [err, user] = await to(authService.getStudent(student.id));
                                                successStudents.push(user);

                                                let arrInstituteList = [];
                                                const instituteJson = {

                                                    student_id: student.id,
                                                    branch_id: branch.toJSON().id,
                                                    create_ip: req.ip
                                                };

                                                arrInstituteList.push(instituteJson)
                                                let instituteList = [];
                                                [err, instituteList] = await to(authService.addInstitutes(arrInstituteList));

                                            }
                                        } else {

                                            var studentEdit = student;
                                            studentEdit.error = 'Student already exist';
                                            errorStudents.push(studentEdit);
                                        }
                                    } else {

                                        var studentEdit = student;
                                        studentEdit.error = 'Country code or mobile number can not be empty.';
                                        errorStudents.push(studentEdit);
                                    }

                                } else {

                                    var studentEdit = student;
                                    studentEdit.error = 'Name can not be empty.';
                                    errorStudents.push(studentEdit);
                                }
                            } else {

                                var studentEdit = student;
                                studentEdit.error = 'Education not found.';
                                errorStudents.push(studentEdit);
                            }
                        } else {

                            var studentEdit = student;
                            studentEdit.error = 'Education Name not available';
                            errorStudents.push(studentEdit);
                        }

                    } else {
                        var studentEdit = student;
                        studentEdit.error = 'Branch not found.';
                        errorStudents.push(studentEdit);
                    }
                } else {

                    var studentEdit = student;
                    studentEdit.error = 'Branch Name not available';
                    errorStudents.push(studentEdit);
                }
            }));


            const responseJSON = {
                errorList: errorStudents,
                successList: successStudents
            };

            return ReS(res, 'File Uploaded successfully.', responseJSON);
        } else {
            return ReE(res, 'Please select proper excel file.', 422);
        }
    } else {
        return ReE(res, 'Please select excel file.', 422);
    }
}
