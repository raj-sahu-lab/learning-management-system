const { to, TE } = require('./util.service');
const CONFIG = require('../../config/config');
var admin = require("firebase-admin");

var serviceAccount = require(CONFIG.STATCI_FILES + 'companyapp-firebase-adminsdk-ujy9f-32a5f86b17.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://companyapp.firebaseio.com"
});


module.exports.SendNotification = async function (notificationToken, payload) {

    var options = {
        priority: "high",
        timeToLive: 60 * 60 *24
      };
    [err, message] = await to(admin.messaging().sendToDevice(notificationToken, payload, options));
    if (err) TE(err.message);
    return message;
}