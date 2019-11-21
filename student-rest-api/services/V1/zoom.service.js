const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const CONFIG = require('../../config/config');
const { to, TE, toWithout } = require('./util.service');

module.exports.CreateUserOnZoom = async function (email, title, key, secret) {

    const payload = {
        iss: key,
        exp: ((new Date()).getTime() + 5000)
    };
    const token = jwt.sign(payload, secret);

    var options = {
        method: "POST",
        uri: "https://api.zoom.us/v2/users/",
        body: {
            action: "create",
            user_info: {
                email: email,
                type: 1,
                first_name: title,
                last_name: "",
                password : "[PASSWORD]"
            }
        },
        auth: {
            bearer: token
        },
        headers: {
            "User-Agent": "Zoom-api-Jwt-Request",
            "content-type": "application/json"
        },
        json: true
    };

    [err, zoomUser] = await toWithout(rp(options));
    if (err) TE(err.error.message);
    return zoomUser;
    
    // rp(options)
    //     .then(function (response) {
    //         console.log("response is: ", response);
    //         res.send("create meeting result: " + JSON.stringify(response));
    //     })
    //     .catch(function (err) {
    //         // API call failed...
    //         console.log("API call failed, reason ", err);
    //     });

}

module.exports.CreateMeetingInZoom = async function (email , meetingPayload, key, secret) {
    const payload = {
        iss: key,
        exp: ((new Date()).getTime() + 5000)
    };
    const token = jwt.sign(payload, secret);
    var options = {
      method: "POST",
      uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
      body: meetingPayload,
      auth: {
        bearer: token
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json"
      },
      json: true //Parse the JSON string in the response
    };

    [err, meetingResult] = await toWithout(rp(options));    
    if(err) TE(err.error.message);
    return meetingResult;
}

module.exports.DeleteMeetingInZoom  = async function (meetingId) {
    const payload = {
        iss: CONFIG.ZoomAPIKey,
        exp: ((new Date()).getTime() + 5000)
    };
    const token = jwt.sign(payload, CONFIG.ZoomAPISecret);

    var options = {
        method: "DELETE",
        uri: "https://api.zoom.us/v2/meetings/" + meetingId,
        auth: {
          bearer: token
        },
        headers: {
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json"
        },
        json: true //Parse the JSON string in the response
    };

    [err, meetingResult] = await toWithout(rp(options));    
    if (err) TE(err.error.message);
    return meetingResult;
}