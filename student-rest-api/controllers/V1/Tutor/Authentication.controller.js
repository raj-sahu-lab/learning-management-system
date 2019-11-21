const authService = require('../../../services/V1/Tutor/Authentication.service');
const { to, ReE, ReS, GetSignUrl } = require('../../../services/V1/util.service');

// Login Checking
module.exports.checkLogin = async function (req, res) {

   const body = req.fields;

   if (!body.phone) {

      return ReE(res, 'Please enter valid phone.', 422);

   } else if (!body.password) {

      return ReE(res, 'Please enter valid password.', 422);

   } else {

      [err, tutor] = await to(authService.checkLogin(body.phone, body.password));
      if (err) return ReE(res, err, 422);

      if(tutor){

         let tutorJSON = tutor.toJSON();
         delete tutorJSON.password;

         tutorJSON.image = await GetSignUrl(tutorJSON.image);
         tutorJSON.branch.account.image = await GetSignUrl(tutorJSON.branch.account.image);
         tutorJSON.userType = 3;
         tutorJSON.bearer_token = tutor.getJWT();
         return ReS(res, 'Tutor Logged successfully.', tutorJSON);

      } else {

         return ReE(res, 'Invalid Credentials. Please try again.', 422);
      }
   }
}

