const liveClassesService = require('../../../services/V1/Student_Enterprise/LiveClass.service');
const { to, ReE, ReS, UploadImage, GetSignUrl } = require('../../../services/V1/util.service');
const CryptoJS = require("crypto-js");
const CONFIG = require('../../../config/config');

// Get Live Classes List
module.exports.getLiveClassList = async function (req, res) {

    [err, liveClassList] = await to(liveClassesService.getLiveClassList(req.user.id));
    if (err) return ReE(res, err, 422);

    if (liveClassList.length == 0) {

        return ReE(res, 'Live Classes List Empty.', 204);

    } else {

        var liveClassSignedList = [];

        await Promise.all(liveClassList.map(async (liveClass) => {

            const liveClassJSON = liveClass.toJSON();
            liveClassJSON.image = await GetSignUrl(liveClassJSON.image);
            liveClassJSON.scheduleTime = (new Date(liveClassJSON.scheduleTime).getTime()) / 1000;
            let response = JSON.parse(liveClassJSON.response);
            delete liveClassJSON.response;
            if(liveClassJSON.userType == 1){
                let meetingDetail = {
                    meetingId: response.id,
                    timezone: response.timezone,
                    start: response.start,
                    numericMeetingId: response.numericMeetingId
                };
                liveClassJSON.meetingDetail = meetingDetail;

            } else if(liveClassJSON.userType == 2){
                let meetingDetail = {
                    meetingId: response.id,
                    timezone: response.timezone,
                    start: response.start_time,
                    password: response.password
                };
                liveClassJSON.meetingDetail = meetingDetail;

            }
            
            liveClassSignedList.push(liveClassJSON);
        }));

        return ReS(res, 'Live Classes List Got Successfully.', liveClassSignedList);
    }
}

// Get Live Classes List
module.exports.getLiveClassKey = async function (req, res) {
    
    [err, liveClassKey] = await to(liveClassesService.getLiveClassKey(req.user.branch.toJSON().id));
    if (err) return ReE(res, err, 422);

    if (!liveClassKey) {

        return ReE(res, 'Live Classes key Empty.', 204);

    } else {
        let liveClassKeyJson = liveClassKey.toJSON();
        liveClassKeyJson.secret = CryptoJS.AES.decrypt(liveClassKeyJson.secret, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        liveClassKeyJson.key = CryptoJS.AES.decrypt(liveClassKeyJson.key, CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return ReS(res, 'Live Classes key Got Successfully.', liveClassKeyJson);
    }
}