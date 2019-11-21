const liveClassesService = require("../../../services/V1/Institute/LiveClass.service");
const tutorService = require("../../../services/V1/Institute/tutor.service");
const { to, ReE, ReS, UploadImage, GetSignUrl, } = require("../../../services/V1/util.service");
const { 
    LoginToBlueJence, 
    CreateMeetingInBlueJence, 
    DeleteUserFromBlueJence, 
    CreateUserInBlueJence, 
    CreateUserDefaultRoomInBlueJence, 
    DeleteMeetingInBlueJence , 
    GetMeetingRecordingsFromBlueJence,
    GetMeetingRecordingsDownloadLink,
    GetMeetingDetailFromBlueJence,
    GetUserMeetingRecordingsFromBlueJence,
    GetUserPastMeetingListFromBlueJence} = require("../../../services/V1/BlueJeans.services");

const { CreateUserOnZoom, CreateMeetingInZoom, DeleteMeetingInZoom } = require("../../../services/V1/zoom.service");
const fs = require("fs");
const moment = require('moment');
const CryptoJS = require("crypto-js");
const CONFIG = require('../../../config/config');

// ================================== Zoom ============================

// Create zoom user
module.exports.createUserLiveClassZoom = async function (req, res) {
    const body = req.fields;
    if (body.tutorId) {
        [err, zoomUser] = await to(liveClassesService.tutorExistbyTutorId(body.tutorId));
        if (err) return ReE(res, 'Failed to process your request. please try again.', 422);

        if (zoomUser) {

            return ReE(res, 'User Already exists', 422);

        } else {

            [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
            if (err) return ReE(res, err, 422);

            if (tutor) {
                var tutorObj = tutor.toJSON();
                // return ReS(res, "User added successfully.", tutorObj);

                if(tutorObj.branch.liveClassKey[0].key && tutorObj.branch.liveClassKey[0].secret){
                    let key = CryptoJS.AES.decrypt(tutorObj.branch.liveClassKey[0].key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                    let secret = CryptoJS.AES.decrypt(tutorObj.branch.liveClassKey[0].secret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

                    [err, response] = await to(CreateUserOnZoom(tutorObj.email, tutorObj.name, key, secret));
                    if (err) return ReE(res, err, 422);
                    if (response) {

                        let userJSON = {
                            accountId: req.user.account_id,
                            tutorId: body.tutorId,
                            response: JSON.stringify(response),
                            create_ip: req.ip
                        };

                        [err, user] = await to(liveClassesService.createZoomUser(userJSON));
                        if (err) return ReE(res, err, 422);
                        if (user) {

                            [err, user] = await to(liveClassesService.getZoomUser(user.id));
                            if (err) return ReE(res, err, 422);
                            if (user) {

                                userJSON = user.toJSON();
                                userJSON.tutor.image = await GetSignUrl(userJSON.tutor.image);
                                userJSON.response = JSON.parse(userJSON.response);

                                return ReS(res, "User added successfully.", userJSON);

                            } else {

                                return ReS(res, "User added successfully.");
                            }
                        } else {
                            return ReE(res, "Failed to add. please try again.", 422);
                        }
                    } else {
                        return ReE(res, "Failed to add. please try again.", 422);
                    }
                } else {
                    return ReE(res, "Add Zoom api and secret key", 422);
                }

            } else {
                return ReE(res, "Selected tutor not found.", 422);
            }
            

            
        }
    } else {
        return ReE(res, "Please select tutor.", 422);
    }
};

// Get Zoom User List
module.exports.getUserLiveClassZoom = async function (req, res) {

    [err, tutorList] = await to(liveClassesService.getZoomUserList(req.user.account_id));
    if (err) return ReE(res, err, 422);
    if (tutorList.length == 0) {

        return ReE(res, 'User list empty.', 204);

    } else {

        var userSignedList = [];

        await Promise.all(tutorList.map(async (user) => {

            var userJSON = user.toJSON();
            userJSON.tutor.image = await GetSignUrl(userJSON.tutor.image);
            userJSON.response = JSON.parse(userJSON.response);

            userSignedList.push(userJSON);
        }));

        return ReS(res, 'All User List Got Successfully.', userSignedList);
    }
}

// Add New Zoom Live Class
module.exports.createZoomLiveClass = async function (req, res) {

    const body = req.fields;

    if (!body.userId) {
        return ReE(res, "Please select user.", 422);
    } else if (req.files.image == null) {
        return ReE(res, "Please select live class image.", 422);
    } else if (!body.title) {
        return ReE(res, "Please enter live classes title.", 422);
    } else if (!body.scheduleTime) {
        return ReE(res, "Please select schedule date and time.", 422);
    } else if (!body.duration) {
        return ReE(res, "Please select duration of live class.", 422);
    } else if (!body.studentId) {
        return ReE(res, "Please select student.", 422);
    } else if (!body.agenda) {
        return ReE(res, "Please enter agenda.", 422);
    } else {


        [err, zoomUser] = await to(liveClassesService.getZoomUser(body.userId));
        if (err) return ReE(res, err, 422);
        // return ReS(res, "Live class created successfully.", zoomUser);

        if (zoomUser) {

            let zoomUserJSON = zoomUser.toJSON();

            if(zoomUserJSON.tutor.branch.liveClassKey[0].key && zoomUserJSON.tutor.branch.liveClassKey[0].secret){
                let key = CryptoJS.AES.decrypt(zoomUserJSON.tutor.branch.liveClassKey[0].key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                let secret = CryptoJS.AES.decrypt(zoomUserJSON.tutor.branch.liveClassKey[0].secret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                
                zoomUserJSON.response = JSON.parse(zoomUserJSON.response);

                let startTime = moment((body.scheduleTime / 1000) * 1000).utc().format();

                const meetingPayload = {

                    topic: body.title,
                    duration: body.duration,
                    type: 2,
                    start_time: startTime,
                    // timezone:"Asia/Calcutta",
                    agenda : body.agenda,
                    settings: {
                        host_video: "true",
                        participant_video: "true"
                    }
                };

                [err, meeting] = await to(CreateMeetingInZoom(zoomUserJSON.response.email, meetingPayload, key, secret));
                if (err) return ReE(res, err, 422);
                if (meeting) {

                    var imageBuffer = fs.readFileSync(req.files.image.path);
                    var name = new Date().getTime().toString() + "_" + req.files.image.name;

                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);

                    const liveClassesInfo = {
                        accountId: req.user.account_id,
                        tutorId: zoomUserJSON.tutor.id,
                        userType: 2,
                        liveClassUserId: body.userId,
                        image: s3Bucket.Key,
                        title: body.title,
                        scheduleTime: (new Date((body.scheduleTime / 1000) * 1000)),
                        studentIds: body.studentId,
                        response: JSON.stringify(meeting),
                        duration: body.duration,
                        agenda: body.agenda,
                        create_ip: req.ip,
                    };

                    [err, liveClass] = await to(liveClassesService.createLiveClass(liveClassesInfo));
                    if (err) return ReE(res, err, 422);
                    if (liveClass) {

                        [err, liveClass] = await to(liveClassesService.getLiveClass(liveClass.id));
                        if (err) return ReE(res, err, 422);

                        var liveClassJSON = liveClass.toJSON();
                        liveClassJSON.image = await GetSignUrl(liveClassJSON.image);
                        liveClassJSON.tutor.image = await GetSignUrl(liveClassJSON.tutor.image);
                        if(liveClassJSON.tutor.branch.liveClassKey.length){
                            liveClassJSON.tutor.zoomKey = CryptoJS.AES.decrypt(liveClassJSON.tutor.branch.liveClassKey[0].key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                        } else {
                            liveClassJSON.tutor.zoomKey = '';
                        }
                        liveClassJSON.tutor.branch = liveClassJSON.tutor.branch.id;
                        liveClassJSON.response = JSON.parse(liveClassJSON.response);

                        [err, studentList] = await to(liveClassesService.getStudentList(liveClassJSON.studentIds));
                        if (studentList) {

                            var studentSignedList = [];
                            await Promise.all(studentList.map(async (student) => {
                                let studentJSON = student.toJSON();
                                studentJSON.image = await GetSignUrl(studentJSON.image);
                                studentSignedList.push(studentJSON);
                            }));

                            liveClassJSON.studentList = studentSignedList;
                        }

                        delete liveClassJSON.studentIds;

                        return ReS(res, "Live class created successfully.", liveClassJSON);

                    } else {

                        return ReE(res, "Failed to create live class, please try again. 4", 422);
                    }
                } else {

                    return ReE(res, "Failed to create live class, please try again. 3", 422);
                }
            } else {
                return ReE(res, "Please add zoom api key and secret key", 422);
            }

        } else {

            return ReE(res, "Failed to create live class, please try again. 1", 422);
        }
    }
};

// ================================== Zoom ============================

// Add User For live class
module.exports.createUserLiveClassblueJence = async function (req, res) {
    const body = req.fields;
    if (body.tutorId) {

        [err, tutor] = await to(tutorService.getTutor(req.user.account_id, body.tutorId));
        if (err) return ReE(res, err, 422);
        if (tutor) {
            var tutorObj = tutor.toJSON();

            [err, loginDetail] = await to(LoginToBlueJence("admin@example.com", "[PASSWORD]"));
            if (err) return ReE(res, err, 422);
            if (loginDetail) {
                const userPayload = {
                    firstName: tutorObj.name,
                    lastName: "",
                    password: "[PASSWORD]",
                    emailId: tutorObj.email,
                    company: "onlinelearning",
                    userName: "platform" + tutorObj.id,
                    title: tutorObj.name,
                    username: "platform." + tutorObj.id,
                    defaultEndpoint: "BROWSER"
                };

                [err, user] = await to(
                    CreateUserInBlueJence(loginDetail.access_token, userPayload)
                );
                if (err) return ReE(res, err, 422);
                if (user) {
                    const roomPayLoad = {

                        moderatorPasscode: "20192020",
                        defaultLayout: "2",
                        name: tutorObj.name,
                        backgroundImage: "images/backgrounds/thumbnails/Slate_solid_thumbnail.gif",
                        autoRecord: false,
                        videoBestFit: true,
                        allow720p: true,
                        playAudioAlerts: true
                    };

                    [err, userRoomSetting] = await to(
                        CreateUserDefaultRoomInBlueJence(
                            loginDetail.access_token,
                            user.id,
                            roomPayLoad
                        )
                    );
                    if (err) return ReE(res, err, 422);
                    if (userRoomSetting) {
                        var userRoomSettingJSON = userRoomSetting;
                        userRoomSettingJSON.userName = "platform." + tutorObj.id;
                        userRoomSettingJSON.password = "[PASSWORD]";

                        let userJSON = {
                            accountId: req.user.account_id,
                            tutorId: body.tutorId,
                            response: JSON.stringify(userRoomSettingJSON),
                            create_ip: req.ip
                        };
                        [err, user] = await to(liveClassesService.createBlueJeanceUser(userJSON));
                        if (err) return ReE(res, err, 422);
                        if (user) {

                            [err, user] = await to(liveClassesService.getBlueJeanceUser(user.id));
                            if (err) return ReE(res, err, 422);
                            if (user) {

                                userJSON = user.toJSON();
                                userJSON.tutor.image = await GetSignUrl(userJSON.tutor.image);
                                userJSON.response = JSON.parse(userJSON.response);

                                return ReS(res, "User added successfully.", userJSON);

                            } else {

                                return ReS(res, "User added successfully.");
                            }
                        } else {
                            return ReE(res, "Failed to add. please try again.", 422);
                        }

                    } else {
                        return ReE(res, "Failed to add. please try again.", 422);
                    }
                } else {
                    return ReE(res, "Failed to add. please try again.", 422);
                }
            } else {
                return ReE(res, "Failed to add. please try again.", 422);
            }
        } else {
            return ReE(res, "Selected tutor not found.", 422);
        }
    } else {
        return ReE(res, "Please select tutor.", 422);
    }
};


// Get Bluejeans User List
module.exports.getBlueJeanceUserList = async function (req, res) {

    [err, tutorList] = await to(liveClassesService.getBlueJeanceUserList(req.user.account_id));
    if (err) return ReE(res, err, 422);
    if (tutorList.length == 0) {

        return ReE(res, 'User list empty.', 204);

    } else {

        var userSignedList = [];

        await Promise.all(tutorList.map(async (user) => {

            var userJSON = user.toJSON();
            userJSON.tutor.image = await GetSignUrl(userJSON.tutor.image);
            userJSON.response = JSON.parse(userJSON.response);

            userSignedList.push(userJSON);
        }));

        return ReS(res, 'All User List Got Successfully.', userSignedList);
    }
}

// Add User For live class
module.exports.deleteUserFromBlueJeance = async function (req, res) {
    var userId = req.params.id;
    if (!userId) {
        return ReE(res, "User id missing.", 422);
    } else {
        [err, loginDetail] = await to(
            LoginToBlueJence("admin@example.com", "[PASSWORD]")
        );
        if (err) return ReE(res, err, 422);
        if (loginDetail) {
            [err, response] = await to(
                DeleteUserFromBlueJence(loginDetail.access_token, 3828395)
            );
            if (err) return ReE(res, err, 422);
            return ReS(res, "User removed successfully.", response);
        } else {
            return ReE(res, "Failed to delete user. please try again.", 422);
        }
    }
};

// Add New Live Class
module.exports.createLiveClass = async function (req, res) {
    // return ReS("Live class created successfully.");

    const body = req.fields;

    if (!body.userId) {
        return ReE(res, "Please select user.", 422);
    } else if (req.files.image == null) {
        return ReE(res, "Please select live class image.", 422);
    } else if (!body.title) {
        return ReE(res, "Please enter live classes title.", 422);
    } else if (!body.scheduleTime) {
        return ReE(res, "Please select schedule date and time.", 422);
    } else if (!body.duration) {
        return ReE(res, "Please select duration of live class.", 422);
    } else if (!body.studentId) {
        return ReE(res, "Please select student.", 422);
    } else if (!body.agenda) {
        return ReE(res, "Please enter agenda.", 422);
    } else {


        [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(body.userId));
        
        if (err) return ReE(res, err, 422);

        if (blueJeanceUser) {

            let blueJeanceUserJSON = user.toJSON();
            blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);
            [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));

            if (err) return ReE(res, err, 422);
            if (loginDetail) {

                let startTime = new Date(body.scheduleTime * 1000);
                let endTime = new Date((body.scheduleTime * 1000) + (body.duration * 60000))

                const meetingPayload = {

                    "title": body.title,
                    "description": body.duration,
                    "start": Math.floor(startTime / 1000),
                    "end": Math.floor(endTime / 1000),
                    "timezone": "Asia/Kolkata",
                    "endPointType": "WEB_APP",
                    "endPointVersion": "2.10",
                    "isLargeMeeting": true,
                    "advancedMeetingOptions": {
                        "disallowChat": false,
                        "encryptionType": "NO_ENCRYPTION",
                        "moderatorLess": false,
                        "muteParticipantsOnEntry": true,
                        "publishMeeting": false,
                        "showAllAttendeesInMeetingInvite": true,
                        "videoBestFit": true,
                        "videoMuteParticipantsOnEntry": false,
                    },
                    "recurrencePattern": {
                        "recurrenceType": "NONE",
                        "endDate": null,
                        "recurrenceCount": 0,
                        "frequency": 0,
                        "daysOfWeekMask": 0,
                        "dayOfMonth": 0,
                        "weekOfMonth": "NONE",
                        "monthOfYear": "NONE"
                    }
                };

                [err, meeting] = await to(CreateMeetingInBlueJence(loginDetail.access_token, loginDetail.scope.user, meetingPayload));
                if (err) return ReE(res, err, 422);
                if (meeting) {

                    var imageBuffer = fs.readFileSync(req.files.image.path);
                    var name = new Date().getTime().toString() + "_" + req.files.image.name;

                    [err, s3Bucket] = await to(UploadImage(req.user.account_id, name, imageBuffer));
                    if (err) return ReE(res, err, 422);

                    const liveClassesInfo = {
                        accountId: req.user.account_id,
                        tutorId: blueJeanceUserJSON.tutor.id,
                        userType : 1,
                        liveClassUserId: body.userId,
                        image: s3Bucket.Key,
                        title: body.title,
                        scheduleTime: (new Date((body.scheduleTime / 1000) * 1000)),
                        studentIds: body.studentId,
                        response: JSON.stringify(meeting),
                        duration: body.duration,
                        agenda: body.agenda,
                        create_ip: req.ip,
                    };

                    [err, liveClass] = await to(liveClassesService.createLiveClass(liveClassesInfo));
                    if (err) return ReE(res, err, 422);
                    if (liveClass) {

                        [err, liveClass] = await to(liveClassesService.getLiveClass(liveClass.id));
                        if (err) return ReE(res, err, 422);

                        var liveClassJSON = liveClass.toJSON();
                        liveClassJSON.image = await GetSignUrl(liveClassJSON.image);
                        liveClassJSON.tutor.image = await GetSignUrl(liveClassJSON.tutor.image);
                        liveClassJSON.response = JSON.parse(liveClassJSON.response);

                        [err, studentList] = await to(liveClassesService.getStudentList(liveClassJSON.studentIds));
                        if (studentList) {

                            var studentSignedList = [];
                            await Promise.all(studentList.map(async (student) => {
                                let studentJSON = student.toJSON();
                                studentJSON.image = await GetSignUrl(studentJSON.image);
                                studentSignedList.push(studentJSON);
                            }));

                            liveClassJSON.studentList = studentSignedList;
                        }

                        delete liveClassJSON.studentIds;

                        return ReS(res, "Live class created successfully.", liveClassJSON);

                    } else {

                        return ReE(res, "Failed to create live class, please try again. 4", 422);
                    }
                } else {

                    return ReE(res, "Failed to create live class, please try again. 3", 422);
                }
            } else {

                return ReE(res, "Failed to create live class, please try again. 2", 422);
            }

        } else {
            
            return ReE(res, "Failed to create live class, please try again. 1", 422);
        }
    }
};

// Get Live Classes List
module.exports.getLiveClassList = async function (req, res) {
    
    [err, liveClassList] = await to(liveClassesService.getLiveClassList(req.user));
    if (err) return ReE(res, err, 422);

    if (liveClassList.length == 0) {

        return ReE(res, "Live Classes List Empty.", 204);

    } else {
        var liveClassSignedList = [];

        await Promise.all(
            liveClassList.map(async (liveClass) => {
                const liveClassJSON = liveClass.toJSON();
                liveClassJSON.image = await GetSignUrl(liveClassJSON.image);
                liveClassJSON.tutor.image = await GetSignUrl(liveClassJSON.tutor.image);
                if(liveClassJSON.tutor.branch.liveClassKey.length){
                    liveClassJSON.tutor.zoomKey = CryptoJS.AES.decrypt(liveClassJSON.tutor.branch.liveClassKey[0].key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
                } else {
                    liveClassJSON.tutor.zoomKey = '';
                }
                liveClassJSON.tutor.branch = liveClassJSON.tutor.branch.id;

                [err, studentList] = await to(liveClassesService.getStudentList(liveClassJSON.studentIds));
                if (studentList) {
                    var studentSignedList = [];
                    await Promise.all(
                        studentList.map(async (student) => {
                            let studentJSON = student.toJSON();
                            studentJSON.image = await GetSignUrl(studentJSON.image);
                            studentSignedList.push(studentJSON);
                        })
                    );

                    liveClassJSON.studentList = studentSignedList;
                }

                liveClassJSON.response = JSON.parse(liveClassJSON.response);

                liveClassSignedList.push(liveClassJSON);
            })
        );

        return ReS(res, "Live Classes List Got Successfully.", liveClassSignedList);
    }
};

// Delete Live Class
module.exports.deleteLiveClass = async function (req, res) {
    var liveClassId = req.params.id;
    if (!liveClassId) {
        return ReE(res, "Live Class id missing.", 422);
    } else {
        [err, liveClass] = await to(liveClassesService.getLiveClass(liveClassId));
        if (err) return ReE(res, err, 422);
        if (liveClass) {

            const liveClassJSON = { delete: 1, update_ip: req.ip };

            [err, liveClassUpdate] = await to(liveClassesService.updateLiveClass(liveClassId, liveClassJSON));
            if (err) return ReE(res, err, 422);

            if (liveClassUpdate.length == 1 && liveClassUpdate[0] == 1) {

                if(liveClass.userType == 1){
                    [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(liveClass.liveClassUserId));
                    if (err) return ReE(res, err, 422);
                    if (blueJeanceUser) {

                        let blueJeanceUserJSON = blueJeanceUser.toJSON();
                        blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);

                        [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));
                        if (err) return ReE(res, err, 422);
                        if (loginDetail) {

                            let response = JSON.parse(liveClass.response);
                            [err, deleteRes] = await to(DeleteMeetingInBlueJence(loginDetail.access_token, loginDetail.scope.user, response.id));
                            if (err) return ReE(res, err, 422);
                            return ReS(res, "Live Class Deleted Successfully.");

                        } else {

                            return ReS(res, "Live Class Deleted Successfully.");
                        }

                    } else {
                        return ReS(res, "Live Class Deleted Successfully.");
                    }
                }

                if(liveClass.userType == 2){
                    let response = JSON.parse(liveClass.response);
                    [err, deleteRes] = await to(DeleteMeetingInZoom(response.id));
                    if (err) return ReE(res, err, 422);
                    return ReS(res, "Live Class Deleted Successfully.");
                }

            } else {

                return ReE(res, "Failed to delete live class. please try again.", 422);
            }

        } else {
            return ReE(res, "Live Class Not Found.", 422);
        }
    }
};

// add live class api key
module.exports.addLiveClassKey = async function (req, res) {

    const body = req.fields;
    if(!body.branchId){

        return ReE(res,'Please select branch id',422);

    } else if(!body.apiKey){

        return ReE(res,'Please enter web api key',422);

    } else if(!body.apiSecret){

        return ReE(res,'Please enter web api secret',422);

    } else if(!body.androidApiKey){

        return ReE(res,'Please enter android api key',422);

    } else if(!body.androidApiSecret){

        return ReE(res,'Please enter android api secret',422);

    } else {

        const liveclassKey = {

            branch_id: body.branchId,
            liveclass_type: 'zoom',
            liveclass_apikey: CryptoJS.AES.encrypt(body.apiKey, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            liveclass_apisecret: CryptoJS.AES.encrypt(body.apiSecret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            android_apikey: CryptoJS.AES.encrypt(body.androidApiKey, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            android_apisecret: CryptoJS.AES.encrypt(body.androidApiSecret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString()
        };

        [err, checkKey] = await to(liveClassesService.checkKeyByType(liveclassKey.branch_id, liveclassKey.liveclass_type));
        if (err) return ReE(res, err, 422);

        if(!checkKey){
            [err, liveClass] = await to(liveClassesService.addLiveClassKey(liveclassKey));
            if (err) return ReE(res, err, 422);

            return ReS(res, 'API key added successfully', liveClass);
        } else {
            ReE(res,'Key exists by type, Please edit existing key',422)
        }

    }
}

module.exports.updateLiveClassKey = async function (req, res) {

    const body = req.fields;
    if(!body.id){

        return ReE(res,'Id missing.',422);

    }if(!body.branchId){

        return ReE(res,'Please select branch id',422);

    } else if(!body.apiKey){

        return ReE(res,'Please enter api key',422);

    } else if(!body.apiSecret){

        return ReE(res,'Please enter api secret',422);

    } else if(!body.androidApiKey){

        return ReE(res,'Please enter android api key',422);

    } else if(!body.androidApiSecret){

        return ReE(res,'Please enter android api secret',422);

    } else {

        const liveclassKey = {

            branch_id: body.branchId,
            liveclass_type: 'zoom',
            liveclass_apikey: CryptoJS.AES.encrypt(body.apiKey, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            liveclass_apisecret: CryptoJS.AES.encrypt(body.apiSecret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            android_apikey: CryptoJS.AES.encrypt(body.androidApiKey, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(),
            android_apisecret: CryptoJS.AES.encrypt(body.androidApiSecret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString()
        };

        [err, key] = await to(liveClassesService.editLiveClassKey(body.id, liveclassKey));
        if (err) return ReE(res, err, 422);

        if (key && key[0] == 1) {

            return ReS(res, 'API key updated successfully');

        } else {

            return ReE(res, 'Failed to update api key, please try again.', 422);
        }

    }
}

module.exports.getLiveClassKey = async function (req, res) {

    [err, liveClassKeyList] = await to(liveClassesService.getLiveClassKey(req.user));

    if (err) return ReE(res, err, 422);
    
    var keyList = [];

    await Promise.all(liveClassKeyList.map(async (lists, index) => {
        let listsJson = lists.toJSON();

        listsJson.liveClassKey.forEach((list) => {
            keyList.push({
                id : list.id, 
                branchId : list.branchId, 
                branch_name: listsJson.branch_name, 
                type: list.type, 
                key : CryptoJS.AES.decrypt(list.key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8), 
                secret : CryptoJS.AES.decrypt(list.secret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8),
                androidkey : CryptoJS.AES.decrypt(list.androidkey, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8), 
                androidSecret : CryptoJS.AES.decrypt(list.androidSecret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
            })
        });
    }));

    return ReS(res, 'All Key Got Successfully.', keyList);
}

// ================================== BlueJeans Recording API's ============================
module.exports.GetRecoringList = async function (req, res) {

    let meetingId = req.params.meetingId;
    let userId = req.params.userId;

    [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(userId));
    if (err) return ReE(res, err, 422);
    if (blueJeanceUser) {
    
        let blueJeanceUserJSON = user.toJSON();
        blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);

        // blueJeanceUserJSON.response.userName = "admin@example.com";
        // blueJeanceUserJSON.response.password = "[PASSWORD]";

        [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));
        if (err) return ReE(res, err, 422);

        if (loginDetail) {

            
            [err, meetingDetiail] = await to(GetMeetingDetailFromBlueJence(loginDetail.access_token, loginDetail.scope.user, meetingId));
            if (err) return ReE(res, err, 422);
            var meetingDetiailObj = JSON.parse(meetingDetiail);
            if(meetingDetiailObj.length >= 1){

                meetingDetiailObj = meetingDetiailObj[meetingDetiailObj.length - 1];

                [err, meetingRecordingList] = await to(GetMeetingRecordingsFromBlueJence(loginDetail.access_token, loginDetail.scope.user, meetingId, meetingDetiailObj.meetingGuid));
                if (err) return ReE(res, err, 422);
                

                let recordingDetail = {
                    recordingList : JSON.parse(meetingRecordingList),
                    meetingDetails : meetingDetiailObj
                };
                
                return ReS(res,"Recording List got successfully.",recordingDetail);

            } else {

                return ReE(res, "Failed to get recording.", 422);
            }           
        } else {
    
            return ReE(res, "Failed to get recording.", 422);
        } 
    } else {

        return ReE(res, "Failed to get recording.", 422);
    }
}


module.exports.GetRecoringDownloadLink = async function (req, res) {

    let contentId = req.params.contentId;
    let userId = req.params.userId;

    [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(userId));
    if (err) return ReE(res, err, 422);
    if (blueJeanceUser) {
    
        let blueJeanceUserJSON = user.toJSON();
        blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);

        // blueJeanceUserJSON.response.userName = "admin@example.com";
        // blueJeanceUserJSON.response.password = "[PASSWORD]";

        [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));
        if (err) return ReE(res, err, 422);

        if (loginDetail) {

            [err, meetingRecordDownload] = await to(GetMeetingRecordingsDownloadLink(loginDetail.access_token, loginDetail.scope.user, contentId));
            if (err) return ReE(res, err, 422);
                        
            return ReS(res,"Recording Download data got successfully.",JSON.parse(meetingRecordDownload));

        } else {
    
            return ReE(res, "Failed to get recording.", 422);
        }   
    } else {

        return ReE(res, "Failed to get recording.", 422);
    }
}

module.exports.GetTutorRecoringList = async function (req, res) {

    let userId = req.params.userId;

    [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(userId));
    if (err) return ReE(res, err, 422);
    if (blueJeanceUser) {
    
        let blueJeanceUserJSON = user.toJSON();
        blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);

        // blueJeanceUserJSON.response.userName = "developer@example.com";
        // blueJeanceUserJSON.response.password = "[PASSWORD]";

        [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));
        if (err) return ReE(res, err, 422);

        if (loginDetail) {

            [err, meetingRecordingList] = await to(GetUserMeetingRecordingsFromBlueJence(loginDetail.access_token, loginDetail.scope.user));
            if (err) return ReE(res, err, 422);
            return ReS(res,"Recording List got successfully.",JSON.parse(meetingRecordingList));

        } else {
    
            return ReE(res, "Failed to get recording 2", 422);
        } 
    } else {

        return ReE(res, "Failed to get recording 1", 422);
    }
}

module.exports.GetTutorPastMeetingList = async function (req, res) {

    let userId = req.params.userId;

    [err, blueJeanceUser] = await to(liveClassesService.getBlueJeanceUser(userId));

    if (err) return ReE(res, err, 422);
    if (blueJeanceUser) {
    
        let blueJeanceUserJSON = user.toJSON();
        blueJeanceUserJSON.response = JSON.parse(blueJeanceUserJSON.response);

        // blueJeanceUserJSON.response.userName = "dev@example.com";
        // blueJeanceUserJSON.response.password = "[PASSWORD]";

        [err, loginDetail] = await to(LoginToBlueJence(blueJeanceUserJSON.response.userName, blueJeanceUserJSON.response.password));
        if (err) return ReE(res, err, 422);

        if (loginDetail) {

            [err, meetingRecordingList] = await to(GetUserPastMeetingListFromBlueJence(loginDetail.access_token, loginDetail.scope.user));
            if (err) return ReE(res, err, 422);
            let meetings = JSON.parse(meetingRecordingList).meetings;
            return ReS(res,"Recording List got successfully.",meetings);

        } else {
    
            return ReE(res, "Failed to get recording", 422);
        } 
    } else {

        return ReE(res, "Failed to get recording", 422);
    }
}





//Create live classes group

module.exports.createLiveclassesGroup = async function (req, res) {

    const body = req.fields;

    if (!body.group_name) {

        return ReE(res, 'Please enter group name.', 422);

    } else if (!body.student_ids || body.student_ids.length == 0) {

        return ReE(res, 'Please select students.', 422);

    } else {
        var groupDetail = {
            group_name: body.group_name,
            create_ip: req.ip
        };

        [err, groupFound] = await to(liveClassesService.checkUniqueGroupName(groupDetail.group_name));
        if (err) return ReE(res, err, 422);

        if (groupFound) {

            return ReE(res, 'Group already exists,Please enter unique group name', 422);

        } else {

            [err, group] = await to(liveClassesService.createLiveclassGroup(groupDetail));
            if (err) return ReE(res, err, 422);

            if (group) {
                var studentsGroup = [];
                var groupJSON = group.toJSON();

                for (let i = 0; i < body.student_ids.length; i++) {
                    studentsGroup.push({
                        group_id: groupJSON.group_id,
                        student_id: body.student_ids[i],
                        create_ip: req.ip
                    });
                }

                [err, StdGroup] = await to(liveClassesService.addStudentsToGroup(studentsGroup));
                if (err) return ReE(res, err, 422);

                if (StdGroup) {

                    [err, liveClassGroup] = await to(liveClassesService.getLiveClassGroup(groupJSON.group_id));
                    if (err) return ReE(res, err, 422);

                    let liveClassGroupJson = liveClassGroup.toJSON();

                    await Promise.all(liveClassGroupJson.group.map(async (StudentGrp) => {
                        if (StudentGrp.student.image != null) {
                            StudentGrp.student.image = await GetSignUrl(StudentGrp.student.image);
                        }

                    }));

                    return ReS(res, 'Liveclass Group Created Successfully.', liveClassGroupJson);

                } else {
                    return ReE(res, 'Failed to add students to group, please try again.', 422);
                }
            } else {

                return ReE(res, 'Failed to create group, please try again.', 422);
            }

        }
    }

}


//Get live class groups

module.exports.getLiveclassGroupsList = async function (req, res) {

    [err, groupList] = await to(liveClassesService.getAllLiveClassGroups());
    if (err) return ReE(res, err, 422);

    if (groupList.length == 0) {

        return ReE(res, 'Group list empty.', 204);

    } else {

        var liveClassGroupList = [];

        await Promise.all(groupList.map(async (group) => {
            var groupJSON = group.toJSON();

            await Promise.all(groupJSON.group.map(async (StudentGrp) => {
                if (StudentGrp.student.image) {
                    StudentGrp.student.image = await GetSignUrl(StudentGrp.student.image);
                }

            }));

            liveClassGroupList.push(groupJSON);
        }));

        return ReS(res, 'All Group List Got Successfully.', liveClassGroupList);
    }
}


//Add students to group
module.exports.addStudentsToGroup = async function (req, res) {
    const body = req.fields;

    if (!body.group_id) {

        return ReE(res, 'Please enter group id.', 422);

    } else if (!body.student_ids || body.student_ids.length == 0) {

        return ReE(res, 'Please select students.', 422);

    } else {

        [err, liveClassGroup] = await to(liveClassesService.getLiveClassGroup(body.group_id));
        if (err) return ReE(res, err, 422);

        if (liveClassGroup == null) {

            return ReE(res, 'Please enter valid group id.', 422);

        } else {

            let groupJSON = liveClassGroup.toJSON();

            [err, studentsList] = await to(liveClassesService.checkStudentsInGroup(groupJSON.group_id, body.student_ids));
            if (err) return ReE(res, err, 422);

            if (studentsList.length == 0) {

                let studentsGroup = [];

                for (let i = 0; i < body.student_ids.length; i++) {
                    studentsGroup.push({
                        group_id: groupJSON.group_id,
                        student_id: body.student_ids[i],
                        create_ip: req.ip
                    });
                }

                [err, StdGroup] = await to(liveClassesService.addStudentsToGroup(studentsGroup));
                if (err) return ReE(res, err, 422);

                if (StdGroup) {

                    [err, liveClassGroup] = await to(liveClassesService.getLiveClassGroup(groupJSON.group_id));
                    if (err) return ReE(res, err, 422);

                    let liveClassGroupJson = liveClassGroup.toJSON();

                    await Promise.all(liveClassGroupJson.group.map(async (StudentGrp) => {
                        if (StudentGrp.student.image != null) {
                            StudentGrp.student.image = await GetSignUrl(StudentGrp.student.image);
                        }

                    }));

                    return ReS(res, 'Students Added to Group List Successfully.', liveClassGroupJson);

                } else {

                    return ReE(res, "Failed to add students, please try again.", 422);

                }

            } else {

                await Promise.all(studentsList.map(async (list) => {
                    let existsStdJSON = list.toJSON();
                    var id = body.student_ids.indexOf(existsStdJSON.student_id);
                    body.student_ids.splice(id, 1);
                }));
                if (body.student_ids.length == 0) {

                    return ReE(res, "Selected students already present in group.", 422);

                } else {
                    let studentsGroup = [];

                    for (let i = 0; i < body.student_ids.length; i++) {
                        studentsGroup.push({
                            group_id: groupJSON.group_id,
                            student_id: body.student_ids[i],
                            create_ip: req.ip
                        });
                    }

                    [err, StdGroup] = await to(liveClassesService.addStudentsToGroup(studentsGroup));
                    if (err) return ReE(res, err, 422);

                    if (StdGroup) {

                        [err, liveClassGroup] = await to(liveClassesService.getLiveClassGroup(groupJSON.group_id));
                        if (err) return ReE(res, err, 422);

                        let liveClassGroupJson = liveClassGroup.toJSON();

                        await Promise.all(liveClassGroupJson.group.map(async (StudentGrp) => {
                            if (StudentGrp.student.image != null) {
                                StudentGrp.student.image = await GetSignUrl(StudentGrp.student.image);
                            }

                        }));

                        return ReS(res, 'Students Added to Group List Successfully.', liveClassGroupJson);

                    } else {

                        return ReE(res, "Failed to add students, please try again.", 422);

                    }

                }
            }

        }

    }
}







//Remove students from group

module.exports.removeStudentsFromGroup = async function (req, res) {

    const body = req.fields;

    if (!body.group_id) {

        return ReE(res, 'Please enter group id.', 422);

    } else if (!body.student_ids || body.student_ids.length == 0) {

        return ReE(res, 'Please select students.', 422);

    } else {

        [err, liveClassGroup] = await to(liveClassesService.getLiveClassGroup(body.group_id));
        if (err) return ReE(res, err, 422);

        if (liveClassGroup == null) {

            return ReE(res, 'Please enter valid group id.', 422);

        } else {
            [err, newList] = await to(liveClassesService.removeStudentsFromGroup(body.group_id, body.student_ids));
            if (err) return ReE(res, err, 422);

            if (newList) {
                return ReS(res, 'Students Removed From Group List Successfully.', newList);
            } else {
                return ReE(res, "Failed to remove students, please try again.", 422);
            }
        }
    }
}