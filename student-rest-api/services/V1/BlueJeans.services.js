const CONFIG = require('../../config/config');
const { to, TE , toWithout } = require('./util.service');
const RequestP = require('request-promise');

const enterpriseId = 426433;

module.exports.LoginToBlueJence  = async function (userName, password) {

    const options = {
        method: 'POST',
        uri: 'https://api.bluejeans.com/oauth2/token#User',
        body: {
            "grant_type": "password",
            "username": userName,
            "password": password
        },
        headers: { 'Accept': 'application/json' },
        json: true
    };    

    [err, loginResult] = await toWithout(RequestP(options));    
    if(err) TE('Failed to create live class, please try again.');
    return loginResult;   
}

module.exports.CreateUserInBlueJence  = async function (accessToken , userPayload) {
    const options = {
        'method': 'POST',
        'uri': 'https://api.bluejeans.com/v1/enterprise/'+enterpriseId+'/users?access_token='+accessToken,
        'headers': { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
        body: userPayload,
        json: true
    };    

    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(err.error.message);
    return meetingResult;
}

module.exports.DeleteUserFromBlueJence  = async function (accessToken , userId) {
    const options = {
        'method': 'DELETE',
        'uri': 'https://api.bluejeans.com/v1/enterprise/'+enterpriseId+'/users/'+userId+'?access_token='+accessToken,
        'headers': { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
        json: true
    };    

    [err, meetingResult] = await to(RequestP(options));
    if(err) TE('Failed to create meeting. please try again.', );
    return meetingResult;
}

module.exports.CreateUserDefaultRoomInBlueJence  = async function (accessToken , userId , roomPayload) {
    const options = {
        'method': 'POST',
        'uri': 'https://api.bluejeans.com/v1/user/'+userId+'/room?access_token='+accessToken,
        'headers': { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
        body: roomPayload,
        json: true
    };    

    [err, meetingResult] = await to(RequestP(options));
    if(err) TE('Failed to create meeting. please try again.', );
    return meetingResult;
}

module.exports.CreateMeetingInBlueJence  = async function (accessToken , userId, meetingPayload) {

    
    const options = {
        'method': 'POST',
        // 'uri': 'https://api.bluejeans.com/v1/user/'+userId+'/scheduled_meeting',
        'uri': 'https://api.bluejeans.com/v1/user/'+userId+'/scheduled_meeting?personal_meeting=false&email=false',
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        },
        body: meetingPayload,
        json: true
    };        
    [err, meetingResult] = await toWithout(RequestP(options));       
    if(err) TE(err.error.message);
    return meetingResult;
}


module.exports.DeleteMeetingInBlueJence  = async function (accessToken , userId, meetingId) {

    
    const options = {
        'method': 'DELETE',
        'uri': 'https://api.bluejeans.com/v1/user/'+userId+'/scheduled_meeting/'+meetingId,
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        },
        json: true
    };        
    [err, meetingResult] = await toWithout(RequestP(options));    
    if(err) TE(err.error);
    return meetingResult;
}


module.exports.GetMeetingDetailFromBlueJence  = async function (accessToken , userId, meetingId) {

    const options = {
        'method': 'GET',
        'uri': 'https://api.bluejeans.com/v1/user/'+userId+'/meeting_history?meetingId='+meetingId,
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    }; 

    [err, meetingResult] = await toWithout(RequestP(options));   
    if(err) TE(err.error);
    return meetingResult;
}

module.exports.GetMeetingRecordingsFromBlueJence  = async function (accessToken , userId, meetingId, meetingGuid) {

    
    const options = {
        'method': 'GET',
        'uri': 'https://api.bluejeans.com/v1/user/'+ userId+'/meeting_history/'+meetingId+'/recordings?meetingGuid='+ meetingGuid,
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    };   
   
    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(JSON.parse(err.error).message);
    return meetingResult;
}

module.exports.GetMeetingRecordingsDetailsFromBlueJence  = async function (accessToken , userId, meetingId, meetingGuid) {

    
    const options = {
        'method': 'GET',
        'uri': 'https://api.bluejeans.com/v1/user/'+ userId+'/meeting_history/'+meetingId +':' + meetingGuid,
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    };   
   
    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(JSON.parse(err.error).message);
    return meetingResult;
}

module.exports.GetMeetingRecordingsDownloadLink  = async function (accessToken , userId, contentId) {

    
    const options = {
        'method': 'GET',
        'uri': 'https://api.bluejeans.com/v1/user/'+ userId +'/cms/'+contentId +'?isDownloadable=true',
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    };       
    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(JSON.parse(err.error).message);
    return meetingResult;
}

module.exports.GetUserMeetingRecordingsFromBlueJence  = async function (accessToken , userId) {

    
    const options = {
        'method': 'GET',
        'uri': 'https://api.bluejeans.com/v1/user/'+ userId+'/meeting_history/recordings/?sortBy=start_time',
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    };   
   
    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(JSON.parse(err.error).message);
    return meetingResult;
}


module.exports.GetUserPastMeetingListFromBlueJence  = async function (accessToken , userId) {

    
    const options = {
        'method': 'GET',
        
        // 'uri': 'https://api.bluejeans.com/v1/enterprise/'+ enterpriseId +'/indigo/meetings?app_name=command_center',
        'uri': 'https://api.bluejeans.com/v1/user/'+ userId +'/indigo/meetings?&app_name=command_center',
        'headers': { 
            'Authorization': 'Bearer '+accessToken,
            'Content-Type': 'application/json'
        }
    };   
   
    [err, meetingResult] = await toWithout(RequestP(options));
    if(err) TE(JSON.parse(err.error).message);
    return meetingResult;
}