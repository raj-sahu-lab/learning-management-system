const express = require('express');
const router = express.Router();

const GeneralController = require('../controllers/V1/General/General.controller');
const EducationController = require('../controllers/V1/Superadmin/Education.controller');
const { newInstituteValidation } = require('../middleware/validators/instituteValidator');

router.get('/', function (req, res, next) {
    res.json({ status: true, message: "This is Company Student Rest api.", data: { "version_number": "v1.0.0" } })
});

router.get('/countryCityList', GeneralController.countryCityList);
router.get('/education', EducationController.getEducationList);

router.get('/baseUrl', GeneralController.baseUrl);

router.post('/institute', newInstituteValidation, GeneralController.addNewInstitute);

router.get('/liveClassJWTToken', GeneralController.generateJWTToken);
router.post('/liveClassSignature', GeneralController.getMeetingSignature);

router.post('/sendTextMessage', GeneralController.sendTextMessage);

router.post('/getSubscription', GeneralController.generateSubscription);

router.post('/razerPaySubscription', GeneralController.razerPaySubscription);



//chargebeeSubscription
router.post('/chargebeeSubscription', GeneralController.chargebeeSubscription)

router.post('/chargeBeeURL' , GeneralController.getChargeBeeUrl);
router.post('/chargeBeeWebhook' , GeneralController.chargebeeSubscriptionWebHook)


module.exports = router;