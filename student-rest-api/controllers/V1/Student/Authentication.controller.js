const authService = require('../../../services/V1/Student/authentication.service');
const authServiceInstitue = require('../../../services/V1/Institute/auth.service');
const { to, ReE, ReS , ReS1, GetSignUrl, UploadStudentImage, DeleteFromBucket, RegisterForMailing, SendStudentRegisterEMail, SendTextMessage } = require('../../../services/V1/util.service');
const sha1 = require('sha1');
const fs = require('fs');
const CONFIG = require('../../../config/config');
const CryptoJS = require("crypto-js");

module.exports.encryptData = async function (req, res) {
   
   const body = req.fields;

   var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(body), CONFIG.STUDENT_ENCRYPTION_KEY).toString();
   return ReS1(res, 'EncryptedString.', { enc: ciphertext });
}



// module.exports.loginWithPhone = async function (req, res) {

//    const body = req.fields;
//    if (!body.phone) {

//       return ReE(res, 'Please enter phone number.', 422);

//    } else if(!body.accessToken){

//       return ReE(res, 'Access token missing.', 422);

//    }else {

//       [err, user] = await to(authService.getStudentByPhone(body.phone));
//       if (err) return ReE(res, err, 422);
      
//       [err, user] = await to(authService.getStudent(user.id));
//       if (err) return ReE(res, err, 422);

//       if (user) {
         
//          if (user.instituteList.branch){
            
//             if(user.instituteList.branch.account.toJSON().accessToken == body.accessToken){

//                var studentJson = { update_ip: req.ip , deviceType: body.deviceType };
   
//                if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS
      
//                   studentJson.androidDeviceId = body.deviceId;
      
//                } else { // 3 - WebSite
      
//                   studentJson.webDeviceId = body.deviceId;
//                }
      
//                // Check Notification Token
//                if (body.notificationToken) {
      
//                   if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS
      
//                      studentJson.androidDeviceToken = body.notificationToken;
      
//                   } else { // 3 - WebSite
      
//                      studentJson.webDeviceToken = body.notificationToken;
//                   }
//                }
      
//                [err, studentUpdate] = await to(authService.updatePersonalInfo(studentJson, user.id));
//                if (err) return ReE(res, 'Failed to verify credentials, please try again.', 422);
      
//                if (studentUpdate.length == 1 && studentUpdate[0] == 1) {
      
//                   [err, student] = await to(module.exports.getStudentInfo(user.id));
//                   if (err) return ReE(res, err, 422);
      
//                   if ((student.instituteList != null) && student.instituteList.isActive == 0) {
//                      return ReE(res, 'Your account disabled by institute.', 422);
//                   }
//                   return ReS(res, 'Student Logged successfully.', student);
      
//                } else {
      
//                   return ReE(res, 'Failed to login. Please try again.', 422);
//                }
//             } else {
      
//                return ReE(res, 'Invalid details.', 422);
//             }
//          } else {
      
//             return ReE(res, 'Your account disabled by admin, please contact your institute.', 422);
//          }
//       } else {

//          return ReE(res, 'Invalid Credentials. Please try again.', 422);
//       }

//    }
// }

// Login Checking
module.exports.login = async function (req, res) {

   const body = req.fields;

   let err, user;


   if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter valid password.', 422);

   } else if (!body.deviceId) {

      return ReE(res, 'Your device can not identified.', 422);

   } else if (!body.deviceType) {

      return ReE(res, 'Your device can not identified.', 422);

   } else {

      [err, user] = await to(authService.authUser(body));
      if (err) return ReE(res, err, 422);

      [err, user] = await to(authService.getStudent(user.id));
      if (err) return ReE(res, err, 422);

      if (user) {


         if(user.instituteList){
            if(user.instituteList.branch.account.accessLevel == 1 && body.deviceType != 3){

               return ReE(res, 'Please login from website only.', 422);

            } else if(user.instituteList.branch.account.accessLevel == 3 && body.deviceType == 3){

               return ReE(res, 'Please login from app only.', 422);

            }
         }

         var studentJson = { update_ip: req.ip , deviceType: body.deviceType };

         if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS

            studentJson.androidDeviceId = body.deviceId;

         } else { // 3 - WebSite

            studentJson.webDeviceId = body.deviceId;
         }

         // Check Notification Token
         if (body.notificationToken) {

            if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS

               studentJson.androidDeviceToken = body.notificationToken;

            } else { // 3 - WebSite

               studentJson.webDeviceToken = body.notificationToken;
            }
         }

         [err, studentUpdate] = await to(authService.updatePersonalInfo(studentJson, user.id));
         if (err) return ReE(res, 'Failed to verify credentials, please try again.', 422);

         if (studentUpdate.length == 1 && studentUpdate[0] == 1) {

            [err, student] = await to(module.exports.getStudentInfo(user.id));
            if (err) return ReE(res, err, 422);

            if ((student.instituteList != null) && student.instituteList.isActive == 0) {
               return ReE(res, 'Your account disabled by institute.', 422);
            }
            return ReS(res, 'Student Logged successfully.', student);

         } else {

            return ReE(res, 'Failed to login. Please try again.', 422);
         }
      } else {

         return ReE(res, 'Invalid Credentials. Please try again.', 422);
      }
   }
}

// Remove Device type and token from database
module.exports.logOutUser = async function (req, res) {

   const deviceType = req.headers.devicetype;

   var studentJson = { update_ip: req.ip };

   if (deviceType == 1 || deviceType == 2) { // 1 - Android , 2 - IOS

      studentJson.androidDeviceId = null;
      studentJson.androidDeviceToken = null;

   } else { // 3 - WebSite

      studentJson.webDeviceId = null;
      studentJson.webDeviceToken = null;
   }
   [err, studentUpdate] = await to(authService.updatePersonalInfo(studentJson, req.user.id));
   if (err) return ReE(res, 'Failed to logout, please try again.', 422);
   if (studentUpdate.length == 1 && studentUpdate[0] == 1) {

      return ReS(res, 'Logout successfully.');

   } else {
      return ReE(res, 'Failed to logout, please try again.', 422);
   }
}

//Send OTP For Registration
module.exports.sendOTPForRegistration = async function (req, res) {

   const body = req.fields;

   if (!body.countryCode) {

      return ReE(res, 'Please select country code.', 422);

   } else if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else {

      [err, user] = await to(authService.studentExistbyPhone(body.phone));
      if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

      if (user) {

         return ReE(res, 'Already exist. please try to login.', 422);

      } else {

         // Generating 4 Digit  OTP for Registration
         const chars = '0987654321';
         var OTPForUser = '';
         for (var i = 4; i > 0; --i) OTPForUser += chars[Math.floor(Math.random() * chars.length)];

         [err, user] = await to(authService.studentExistInTempRegister(body.countryCode + body.phone));
         if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

         const addToOTP = { phone_no: body.countryCode + body.phone, otp: OTPForUser, create_ip: req.ip };

         if (user) {

            if (user.isVerified == 1) {

               return ReS(res, 'OTP already verified.', { status: 200 });

            } else {

               [err, user] = await to(authService.updateUserToOTP(addToOTP, user.id));
               if (err) return ReE(res, err, 422);
               const otpTextMessage = 'Hi! Thanks for signing up. Please use ' + OTPForUser + ' to validate your account.';

               [err, response] = await to(SendTextMessage(body.countryCode + body.phone, otpTextMessage));
               if (err) return ReE(res, 'Failed to send OTP, please try again.', 422);
               return ReS(res, 'OTP send successfully.');

            }
         } else {

            [err, user] = await to(authService.addUserToOTP(addToOTP));
            if (err) return ReE(res, err, 422);
            const otpTextMessage = 'Hi! Thanks for signing up. Please use ' + OTPForUser + ' to validate your account.';
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

      [err, user] = await to(authService.checkOTPIsValid(body.phone, body.otp));
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
            [err, user] = await to(authService.updateUserToOTP(addToOTP, user.id));
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

   } else if (!body.deviceId) {

      return ReE(res, 'Your device can not identified.', 422);

   } else if (!body.deviceType) {

      return ReE(res, 'Your device can not identified.', 422);

   } else {

      [err, user] = await to(authService.studentExistbyPhone(body.phone));
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
            deviceType: body.deviceType,
            sendInBlue_id: sendInBlueId,
            create_ip: req.ip
         };

         if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS

            studentJson.androidDeviceId = body.deviceId;

         } else { // 3 - WebSite

            studentJson.webDeviceId = body.deviceId;
         }

         // Check Notification Token
         if (body.notificationToken) {

            if (body.deviceType == 1 || body.deviceType == 2) { // 1 - Android , 2 - IOS

               studentJson.androidDeviceToken = body.notificationToken;

            } else { // 3 - WebSite

               studentJson.webDeviceToken = body.notificationToken;
            }
         }

         [err, student] = await to(authService.deleteStudentFromTemp(body.countryCode + body.phone));

         [err, student] = await to(authService.registerStudent(studentJson));
         if (err) return ReE(res, err, 422);

         [err, user] = await to(authService.getStudent(student.id));
         if (err) return ReE(res, err, 422);

         if (body.email) {

            [err, info] = await to(SendStudentRegisterEMail(body.email, body.firstName + ' ' + body.lastName, body.phone, body.password));
         }

         [err, student] = await to(module.exports.getStudentInfo(student.id));
         if (err) return ReE(res, err, 422);

         return ReS(res, 'Student Register successfully.', student);
      }
   }
}


// Set Branch
module.exports.registerStudentBranch = async function (req, res) {

   const body = req.fields;
   if (!body.code) {

      return ReE(res, 'Please enter code.', 422);

   } else {


      [err, branch] = await to(authService.getBranchByCode(body.code));
      if (err) return ReE(res, err, 422);
      if (branch) {

         var arrInstituteList = [];
         [err, ins] = await to(authService.studentAlreadyInInstitute(branch.branch_id, req.user.id));
         if (ins == null) {

            const instituteJson = {

               student_id: req.user.id,
               branch_id: branch.branch_id,
               create_ip: req.ip
            };

            arrInstituteList.push(instituteJson)
            await to(authService.addInstitutes(arrInstituteList));
         }

         const studentInfo = { defaultBranch: branch.branch_id };

         [err, user] = await to(authService.updateStudent(req.user.id, studentInfo));
         if (err) return ReE(res, err, 422);
         if (user.length === 1 && user[0] == 1) {

            [err, student] = await to(module.exports.getStudentInfo(req.user.id));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Registered successfully.', student);

            return ReS(res, 'Registered successfully.');

         } else {

            return ReE(res, 'Failed to update register , please try again.', 422);
         }
      } else {

         return ReE(res, 'Invalid Code.', 422);
      }

   }
}

// Forgot password
module.exports.forGotPasswordReset = async function (req, res) {

   const body = req.fields;
   if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else {

      [err, user] = await to(authService.forGotPasswordReset(body.phone));
      if (err) return ReE(res, err, 422);
      if (user) {

         const chars = '0987654321';
         var OTPForUser = '';
         for (var i = 4; i > 0; --i) OTPForUser += chars[Math.floor(Math.random() * chars.length)];

         const otpTextMessage = 'Hi, Please use ' + OTPForUser + ' to reset your password. Thanks';

         //Sending OTP to Learner

         [err, response] = await to(SendTextMessage(user.countrycode + user.phone, otpTextMessage));
         if (err) return ReE(res, 'Failed to send OTP, please try again.', 422);
         return ReS(res, 'OTP send successfully.', { otp: OTPForUser });


      } else {

         return ReE(res, 'Please enter valid phone number.', 422);
      }
   }
}

// Update New Password After Verifying OTP
module.exports.updatePassword = async function (req, res) {

   const body = req.fields;
   if (!body.phone) {

      return ReE(res, 'Please enter phone number.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter new password.', 422);

   } else {

      [err, user] = await to(authService.updatePassword(body.phone, sha1(body.password)));
      if (err) return ReE(res, err, 422);
      if (user.length === 1 && user[0] == 1) {

         return ReS(res, 'Password updated successfully.');

      } else {

         return ReE(res, 'Failed to update password, please try again.', 422);
      }

   }
}



// Save Student Interested Institutes
module.exports.addStudentInstitute = async function (req, res) {

   const body = req.fields;
   if (!body.instituteIdList) {

      return ReE(res, 'Please select institutes.', 422);

   } else if (body.instituteIdList.length == 0) {

      return ReE(res, 'Please select institutes.', 422);

   } else {

      var arrInstituteList = [];
      await Promise.all(body.instituteIdList.map(async (instituteId) => {

         [err, ins] = await to(authService.studentAlreadyInInstitute(instituteId, req.user.id));
         if (ins == null) {

            const instituteJson = {

               student_id: req.user.id,
               branch_id: instituteId,
               create_ip: req.ip
            };
            arrInstituteList.push(instituteJson)
         }
      }));

      [err, instituteList] = await to(authService.addInstitutes(arrInstituteList));
      if (err) return ReE(res, err, 422);

      [err, student] = await to(module.exports.getStudentInfo(req.user.id));
      if (err) return ReE(res, err, 422);

      return ReS(res, 'Institute saved successfully.', student);
   }
}


// Return Institute List 
module.exports.instituteList = async function (req, res) {


   [err, instituteList] = await to(authService.instituteList());
   if (err) return ReE(res, err, 422);

   if (instituteList.length == 0) {

      return ReS(res, 'Institute List empty.', [], 204);

   } else {

      var singednURlInstituteList = [];

      await Promise.all(instituteList.map(async (institute) => {

         var instituteJson = institute.toJSON();
         instituteJson.account.image = await GetSignUrl(instituteJson.account.image);
         singednURlInstituteList.push(instituteJson)

      }));

      return ReS(res, 'Institute List get successfully.', singednURlInstituteList);
   }
}


// Return Institute List 
module.exports.studentSelectedInstituteList = async function (req, res) {


   [err, instituteList] = await to(authService.studentSelectedInstituteList(req.user.id));
   if (err) return ReE(res, err, 422);

   if (instituteList.length == 0) {

      return ReS(res, 'Institute List empty.', [], 204);

   } else {

      var singednURlInstituteList = [];

      await Promise.all(instituteList.map(async (institute) => {

         var instituteJson = institute.toJSON();
         instituteJson.branch.account.image = await GetSignUrl(instituteJson.branch.account.image);
         singednURlInstituteList.push(instituteJson.branch)

      }));

      return ReS(res, 'Institute List get successfully.', singednURlInstituteList);
   }
}

// Set default Institute
module.exports.studentDefaultInstitute = async function (req, res) {

   const body = req.fields;
   if (body) {

      const studentInfo = {

         defaultBranch: body.instituteId
      };

      [err, user] = await to(authService.updateStudent(req.user.id, studentInfo));
      if (err) return ReE(res, err, 422);
      if (user.length === 1 && user[0] == 1) {

         [err, student] = await to(module.exports.getStudentInfo(req.user.id));
         if (err) return ReE(res, err, 422);

         return ReS(res, 'Institute updated successfully.', student);

      } else {

         return ReE(res, 'Failed to update Institute , please try again.', 422);
      }

   } else {

      return ReE(res, 'Institute id missing.', 244);
   }
}

module.exports.getStudentInfo = async (studentId) => {

   [err, user] = await to(authService.getStudent(studentId));
   if (err) return ReE(res, err, 422);

   let res_user = user.toWeb();
   res_user.bearer_token = user.getJWT();

   if (res_user.image) {

      res_user.image = await GetSignUrl(res_user.image);
   }

   if (res_user.branch) {

      res_user.branch.account.image = await GetSignUrl(res_user.branch.account.image);

   }

   // var accountSignedList = [];

   // await Promise.all(res_user.instituteList.map(async (account) => {

   //    let accountJSON = account;
   //    accountJSON.branch.account.image = await GetSignUrl(accountJSON.branch.account.image);

   //    accountSignedList.push(accountJSON);

   // }));
   // res_user.instituteList = accountSignedList;
   if (res_user.instituteList) {

      res_user.instituteList.branch.account.image = await GetSignUrl(res_user.instituteList.branch.account.image);
   }

   return res_user;
}


// Update Personal Information of the student
module.exports.updatePersonalInfo = async (req, res) => {

   if (req.params.isShort) {

      const body = req.fields;

      if (!body.countryId) {

         return ReE(res, 'Please select country.', 422);

      } else if (!body.cityId) {

         return ReE(res, 'Please select city.', 422);

      } else if (!body.pincode) {

         return ReE(res, 'Please enter pin code.', 422);

      } else if (!body.gender) {

         return ReE(res, 'Please select gender.', 422);

      } else {

         const studentJson = {

            country_id: body.countryId,
            city_id: body.cityId,
            pincode: body.pincode,
            gender: body.gender,
            update_ip: req.ip
         };

         [err, student] = await to(authService.updatePersonalInfo(studentJson, req.user.id));
         if (err) return ReE(res, err, 422);

         if (student.length == 1 && student[0] == 1) {

            [err, student] = await to(module.exports.getStudentInfo(req.user.id));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Student info updated successfully.', student);

         } else {

            return ReE(res, 'Failed to update info, please try again.', 422);

         }
      }

   } else {

      const body = req.fields;

      if (!body.firstName) {

         return ReE(res, 'Please enter first name.', 422);

      } else if (!body.lastName) {

         return ReE(res, 'Please enter last name.', 422);

      } else if (!body.educationType) {

         return ReE(res, 'Please select education type.', 422);

      } else if (!body.email) {

         return ReE(res, 'Please enter Email.', 422);

      } else {

         const studentJson = {

            first_name: body.firstName,
            last_name: body.lastName,
            education_type_id: body.educationType,
            email: body.email,
            country_id: body.countryId,
            city_id: body.cityId,
            pincode: body.pincode,
            time_zone: body.timeZone,
            gender: body.gender,
            update_ip: req.ip
         };

         [err, student] = await to(authService.updatePersonalInfo(studentJson, req.user.id));
         if (err) return ReE(res, err, 422);

         if (student.length == 1 && student[0] == 1) {

            [err, student] = await to(module.exports.getStudentInfo(req.user.id));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'Student info updated successfully.', student);

         } else {

            return ReE(res, 'Failed to update info, please try again.', 422);

         }
      }
   }
}

// update student account verified
module.exports.updateVerified = async (req, res) => {

   const body = req.fields;

   if (!body.id) {

      return ReE(res, 'Student id missing', 422);

   } else {

      const studentJson = {
         verified : 0
      };

      [err, student] = await to(authService.updatePersonalInfo(studentJson, body.id));
      if (err) return ReE(res, err, 422);

      if (student.length == 1 && student[0] == 1) {

         return ReS(res, 'Student info updated successfully.');

      } else {

         return ReE(res, 'Failed to update info, please try again.', 422);

      }
   }
}


module.exports.changeProfilePicture = async (req, res) => {

   if (req.files.image == null) {

      return ReE(res, 'Please select image.', 422);

   } else {

      [err, result] = await to(authService.getStudent(req.user.id))
      if (err) return ReE(res, err, 422)

      var imageName = result.toJSON().image;
      if (imageName) {

         [err, result] = await to(DeleteFromBucket({ imageName }))
      }

      var imageBuffer = fs.readFileSync(req.files.image.path);
      var name = 'TOA_Student_' + (new Date().getTime().toString()) + '_' + req.files.image.name;

      [err, s3Bucket] = await to(UploadStudentImage(name, imageBuffer));
      if (err) return ReE(res, err, 422);

      imageName = s3Bucket.Key;

      const studentJson = {

         image: imageName,
         update_ip: req.ip
      };

      [err, student] = await to(authService.updatePersonalInfo(studentJson, req.user.id));
      if (err) return ReE(res, err, 422);

      if (student.length == 1 && student[0] == 1) {

         [err, student] = await to(module.exports.getStudentInfo(req.user.id));
         if (err) return ReE(res, err, 422);

         return ReS(res, 'Student profile updated successfully.', student);

      } else {

         return ReE(res, 'Failed to update info, please try again.', 422);

      }
   }
}

module.exports.getStudentProfile = async (req, res) => {

   [err, student] = await to(module.exports.getStudentInfo(req.user.id));
   if (err) return ReE(res, err, 422);

   return ReS(res, 'Student profile got successfully.', student);
}

module.exports.changePassword = async (req, res) => {

   const body = req.fields;

   if (!body.oldPassword) {

      return ReE(res, 'Please enter old password.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter password.', 422);

   } else if (!body.confirmPassword) {

      return ReE(res, 'Please enter confirm password.', 422);

   } else if (body.confirmPassword != body.password) {

      return ReE(res, 'Passwords are not same. please type again.', 422);

   } else {

      [err, user] = await to(authService.studentExistByPassword(req.user.id, sha1(body.oldPassword)));
      if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

      if (user == null) {

         return ReE(res, 'Old password didn\'t match.', 422);

      } else {

         const studentJson = {

            password: sha1(body.password),
            update_ip: req.ip
         };
         
         studentJson.androidDeviceId = null;
         studentJson.androidDeviceToken = null;
         studentJson.webDeviceId = null;
         studentJson.webDeviceToken = null;

         [err, student] = await to(authService.updatePersonalInfo(studentJson, req.user.id));
         if (err) return ReE(res, err, 422);

         if (student.length == 1 && student[0] == 1) {

            return ReS(res, 'Password changed successfully successfully.');

         } else {

            return ReE(res, 'Failed to change password, please try again.', 422);

         }

      }
   }
}