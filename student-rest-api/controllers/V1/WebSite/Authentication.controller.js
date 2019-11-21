const authService = require('../../../services/V1/WebSite/authentication.service');
const authStudentService = require('../../../services/V1/Student/authentication.service');
const dashboardServiceWebsite = require('../../../services/V1/WebSite/Dashboard.service');
const { to, ReE, ReS, ReS1, GetSignUrl, UploadStudentImage, DeleteFromBucket, RegisterForMailing, SendStudentRegisterEMail, SendTextMessage } = require('../../../services/V1/util.service');
const sha1 = require('sha1');
const request = require('request');
const fs = require('fs');

const CONFIG = require('../../../config/config');
const CryptoJS = require("crypto-js");


module.exports.encryptData = async function (req, res) {
   const body = req.fields;

   var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(body), CONFIG.WEBSITE_ENCRYPTION_KEY).toString();
   return ReS1(res, 'EncryptedString.', { enc: ciphertext });
}

// Login Checking
module.exports.login = async function (req, res) {

   const body = req.fields;
   let err, user;

   if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter valid password.', 422);

   } else {

      [err, user] = await to(authService.authUser(body));
      if (err) return ReE(res, err, 422);

      if (user) {

         [err, student] = await to(module.exports.getStudentInfo(user.id));
         if (err) return ReE(res, err, 422);

         if (student) {

            let studentJSON = student;

            [err, account] = await to(dashboardServiceWebsite.getRequestedAccountById(req.user.id));
            if (account) {
               studentJSON.bearer_token = account.getJWTWebsite(studentJSON.id);
            }

            if (student.instituteList.isActive && student.instituteList.isActive == 0) {
               return ReE(res, 'Your account disabled by institute.', 422);
            }
            
            return ReS(res, 'Student Logged successfully.', studentJSON);
         } else {

            return ReE(res, 'Invalid Credentials. Please try again.', 422);
         }
      } else {

         return ReE(res, 'Invalid Credentials. Please try again.', 422);

      }
   }
}

// Get Student Details
module.exports.getStudentInfo = async (studentId) => {


   [err, user] = await to(authService.getStudent(studentId));
   if (err) return ReE(res, err, 422);

   var res_user = user.toJSON();
   res_user.student_token = user.getJWT();

   if (res_user.image) {
      res_user.image = await GetSignUrl(res_user.image);
   }

   if (res_user.branch) {

      res_user.branch.account.image = await GetSignUrl(res_user.branch.account.image);

   }


   return res_user;
}

//Send OTP For Registration
module.exports.sendOTPForRegistration = async function (req, res) {

   const body = req.fields;

   if (!body.countryCode) {

      return ReE(res, 'Please select country code.', 422);

   } else if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else {

      [err, user] = await to(authStudentService.studentExistbyPhone(body.phone));
      if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

      if (user) {

         return ReE(res, 'Already exist. please try to login.', 422);

      } else {

         // Generating 4 Digit  OTP for Registration
         const chars = '0987654321';
         var OTPForUser = '';
         for (var i = 4; i > 0; --i) OTPForUser += chars[Math.floor(Math.random() * chars.length)];

         [err, user] = await to(authStudentService.studentExistInTempRegister(body.countryCode + body.phone));
         if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

         const addToOTP = { phone_no: body.countryCode + body.phone, otp: OTPForUser, create_ip: req.ip };

         if (user) {

            if (user.isVerified == 1) {

               return ReS(res, 'OTP already verified.', { status: 200 });

            } else {

               [err, user] = await to(authStudentService.updateUserToOTP(addToOTP, user.id));
               if (err) return ReE(res, err, 422);
               const otpTextMessage = 'Your Company Registration OTP: ' + OTPForUser;

               [err, response] = await to(SendTextMessage(body.countryCode + body.phone, otpTextMessage));
               if (err) return ReE(res, 'Failed to send OTP, please try again.', 422);
               return ReS(res, 'OTP send successfully.');

            }
         } else {

            [err, user] = await to(authStudentService.addUserToOTP(addToOTP));
            if (err) return ReE(res, err, 422);
            const otpTextMessage = 'Your Company Registration OTP: ' + OTPForUser;
            [err, response] = await to(SendTextMessage(body.countryCode + body.phone, otpTextMessage));
            if (err) return ReE(res, 'Failed to send OTP, please try again.', 422);
            return ReS(res, 'OTP send successfully.');
         }
      }
   }
}

// verify Sent OTP
module.exports.verifyUserOTP = async function (req, res) {

   const body = req.fields;
   if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else if (!body.otp) {

      return ReE(res, 'Please enter OTP.', 422);

   } else {

      [err, user] = await to(authStudentService.checkOTPIsValid(body.phone, body.otp));
      if (err) return ReE(res, err, 422);

      if (user) {

         let firstDate = new Date(user.updatedAt),
            secondDate = new Date(),
            timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());

         const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
         if (differentDays > 1) {

            return ReS(res, 'OTP expired. please try again.');

         } else {

            const addToOTP = { isVerified: 1 };
            [err, user] = await to(authStudentService.updateUserToOTP(addToOTP, user.id));
            return ReS(res, 'OTP verified successfully.');
         }
      } else {

         return ReE(res, 'Please enter valid OTP.', 422);
      }
   }
}

// Register Student
module.exports.registerStudent = async function (req, res) {


   const body = req.fields;
   if (!body.countryCode) {

      return ReE(res, 'Please enter country code.', 422);

   } else if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else if (!body.firstName) {

      return ReE(res, 'Please enter first name.', 422);

   } else if (!body.educationType) {

      return ReE(res, 'Please select education type.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter password.', 422);

   } else {

      [err, user] = await to(authStudentService.studentExistbyPhone(body.phone));
      if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

      if (user) {

         return ReE(res, 'Already exist. please try to login.', 422);

      } else {

         var sendInBlueId = null;
         if (body.email) {

            [err, result] = await to(RegisterForMailing(body.email, body.firstName, body.lastName));
            if (result) {
               sendInBlueId = result.id;
            }
         }

         const studentJson = {

            first_name: body.firstName,
            last_name: body.lastName,
            countrycode: body.countryCode,
            phone: body.phone,
            education_type_id: body.educationType,
            password: sha1(body.password),
            email: body.email,
            sendInBlue_id: sendInBlueId,
            notificationToken: body.notificationToken,
            deviceType: body.deviceType,
            create_ip: req.ip
         };

         [err, student] = await to(authStudentService.deleteStudentFromTemp(body.countryCode + body.phone));

         [err, student] = await to(authStudentService.registerStudent(studentJson));
         if (err) return ReE(res, err, 422);

         [err, user] = await to(authStudentService.getStudent(student.id));
         if (err) return ReE(res, err, 422);

         if (body.email) {

            [err, info] = await to(SendStudentRegisterEMail(body.email, body.firstName + ' ' + body.lastName, body.phone, body.password));
         }

         [err, student] = await to(module.exports.getStudentInfo(student.id));
         if (err) return ReE(res, err, 422);

         let studentJSON = student;
         if (req.user) {
            [err, account] = await to(dashboardServiceWebsite.getRequestedAccountById(req.user.id));
            if (account) {
               studentJSON.bearer_token = account.getJWTWebsite(studentJSON.id);
            }
         }

         return ReS(res, 'Student Register successfully.', studentJSON);
      }
   }
}

// Set Branch
module.exports.registerStudentBranch = async function (req, res) {

   const body = req.fields;
   if (!body.code) {

      return ReE(res, 'Please enter code.', 422);

   } else {


      [err, branch] = await to(authStudentService.getBranchByCode(body.code));
      if (err) return ReE(res, err, 422);
      if (branch && req.user.student) {

         var arrInstituteList = [];
         [err, ins] = await to(authStudentService.studentAlreadyInInstitute(branch.branch_id, req.user.student.id));
         if (ins == null) {

            const instituteJson = {

               student_id: req.user.student.id,
               branch_id: branch.branch_id,
               create_ip: req.ip
            };

            arrInstituteList.push(instituteJson)
            await to(authStudentService.addInstitutes(arrInstituteList));
         }

         const studentInfo = { defaultBranch: branch.branch_id };

         [err, user] = await to(authStudentService.updateStudent(req.user.student.id, studentInfo));
         if (err) return ReE(res, err, 422);
         if (user.length === 1 && user[0] == 1) {


            [err, student] = await to(module.exports.getStudentInfo(req.user.student.id));
            if (err) return ReE(res, err, 422);

            let studentJSON = student;
            [err, account] = await to(dashboardServiceWebsite.getRequestedAccountById(req.user.id));
            if (account) {
               studentJSON.bearer_token = account.getJWTWebsite(studentJSON.id);
            }

            return ReS(res, 'Registered successfully.', studentJSON);

         } else {

            return ReE(res, 'Failed to update register , please try again.', 422);
         }
      } else {

         return ReE(res, 'Invalid Code.', 422);
      }

   }
}