const express = require('express');
const router = express.Router();

const SuperAdminController = require('../controllers/V1/Superadmin/superadmin.controller');
const PlanController = require('../controllers/V1/Superadmin/plan.controller');
const SMSController = require('../controllers/V1/Superadmin/sms.controller');
const EmailController = require('../controllers/V1/Superadmin/email.controller');
const OfferController = require('../controllers/V1/Superadmin/offer.controller');
const EducationController = require('../controllers/V1/Superadmin/Education.controller');
const MenuController = require('../controllers/V1/Superadmin/MenuManagment.controller');
const OverViewController = require('../controllers/V1/Superadmin/OverView.controller');
const InAppPurchaseViewController = require('../controllers/V1/Superadmin/IOSInAppPurchase.controller');
const NotificationsController = require('../controllers/V1/Superadmin/Notification.controller');
const CurrencyController = require('../controllers/V1/Superadmin/Currency.controller');
const DashboardController = require('../controllers/V1/Superadmin/dashboard.controller');
const passport = require('passport');
const path = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: true, message: "This is Company Rest api.", data: { "version_number": "v1.0.0" } })
});



//========================= Super Admin Related All Services Module =========================

// Institute Related 
// router.post(    '/create',            SuperAdminController.createAdmin);

// router.post(    '/updateUUID',            SuperAdminController.updateUUID);

router.post('/login', SuperAdminController.getAdmin);
router.post('/updatePassword', passport.authenticate('admin', { session: false }), SuperAdminController.chnagePassword);



router.post('/users/create', passport.authenticate('admin', { session: false }), SuperAdminController.addNewInstitute);
router.put('/users', passport.authenticate('admin', { session: false }), SuperAdminController.editInstitute);
router.get('/users', passport.authenticate('admin', { session: false }), SuperAdminController.getAllUsers);
router.post('/enableLink', passport.authenticate('admin', { session: false }), SuperAdminController.enableDisableUltimateLink);

// Terms Realated
router.post('/term', passport.authenticate('admin', { session: false }), PlanController.addTerm);
router.put('/term', passport.authenticate('admin', { session: false }), PlanController.editTerm);
router.get('/term', passport.authenticate('admin', { session: false }), PlanController.getTermList);
router.delete('/term/:id', passport.authenticate('admin', { session: false }), PlanController.deleteTerm);


// Plan Realated
router.post('/plan', passport.authenticate('admin', { session: false }), PlanController.createPlan);
router.put('/plan', passport.authenticate('admin', { session: false }), PlanController.editPlan);
router.get('/plan', passport.authenticate('admin', { session: false }), PlanController.getPlanList);
router.delete('/plan/:id', passport.authenticate('admin', { session: false }), PlanController.deletePlan);

// Plan Detail Realated
router.post('/planDetail', passport.authenticate('admin', { session: false }), PlanController.createPlanDetail);
router.put('/planDetail', passport.authenticate('admin', { session: false }), PlanController.editPlanDetail);
router.get('/planDetail', passport.authenticate('admin', { session: false }), PlanController.getPlanDetailList);
router.delete('/planDetail/:id', passport.authenticate('admin', { session: false }), PlanController.deletePlanDetail);

// Credit SMS to institute 
router.post('/addSMS', passport.authenticate('admin', { session: false }), SMSController.addSMSCredit);
router.get('/getSMSList/:id*?', passport.authenticate('admin', { session: false }), SMSController.getAllSMSCreditList);

// Send SMS
router.post('/sendSMS', passport.authenticate('admin', { session: false }), SMSController.sendTwilioSMS);

// Credit Email to institute 
router.post('/addEmail', passport.authenticate('admin', { session: false }), EmailController.addEmailCredit);
router.get('/getEmailList/:id*?', passport.authenticate('admin', { session: false }), EmailController.getAllEmailCreditList);

// Offer Related
router.post('/offer', passport.authenticate('admin', { session: false }), OfferController.addOffer);
router.get('/offer', passport.authenticate('admin', { session: false }), OfferController.getOfferList);
router.put('/offer', passport.authenticate('admin', { session: false }), OfferController.updateOffer);
router.delete('/offer/:id', passport.authenticate('admin', { session: false }), OfferController.deleteOffer);

// Education Related
router.post('/education', passport.authenticate('admin', { session: false }), EducationController.addEducation);
router.get('/education', passport.authenticate('admin', { session: false }), EducationController.getEducationList);
router.put('/education', passport.authenticate('admin', { session: false }), EducationController.updateEducation);
router.delete('/education/:id', passport.authenticate('admin', { session: false }), EducationController.deleteEducation);

router.get('/termsAndPlan', passport.authenticate('admin', { session: false }), PlanController.getTermsAndPlanList);

// router.post(   '/uploadCountryCity',                passport.authenticate('admin', {session:false}), MenuController.uploadCountryCity);

// Menu
// router.get(    '/menuSubMenu',         passport.authenticate('admin', {session:false}), MenuController.getAllMenuSubMenu);

// router.post(   '/menu',                passport.authenticate('admin', {session:false}), MenuController.addMenu);
// router.get(    '/menu',                passport.authenticate('admin', {session:false}), MenuController.getMenuList);
// router.put(    '/menu',                passport.authenticate('admin', {session:false}), MenuController.updateMenu);
// router.delete( '/menu/:id',            passport.authenticate('admin', {session:false}), MenuController.deleteMenu);

// // Menu Sub
// router.post(   '/menuSub',                passport.authenticate('admin', {session:false}), MenuController.addSubMenu);
// router.get(    '/menuSub',                passport.authenticate('admin', {session:false}), MenuController.getSubMenuList);
// router.put(    '/menuSub',                passport.authenticate('admin', {session:false}), MenuController.updateSubMenu);
// router.delete( '/menuSub/:id',            passport.authenticate('admin', {session:false}), MenuController.deleteSubMenu);

router.get('/tutorList/:id', passport.authenticate('admin', { session: false }), OverViewController.getTutorList);
router.get('/studentList/:id', passport.authenticate('admin', { session: false }), OverViewController.getStudentList);


router.post('/inAppPurchase', passport.authenticate('admin', { session: false }), InAppPurchaseViewController.addInAppPurchase);
router.get('/inAppPurchase', passport.authenticate('admin', { session: false }), InAppPurchaseViewController.getInAppPurchaseList);
router.put('/inAppPurchase', passport.authenticate('admin', { session: false }), InAppPurchaseViewController.updateInAppPurchase);
router.delete('/inAppPurchase/:id', passport.authenticate('admin', { session: false }), InAppPurchaseViewController.deleteInAppPurchase);

router.post('/smsEmailPlans', passport.authenticate('admin', { session: false }), SMSController.addSMSPlan);
router.get('/smsEmailPlans', passport.authenticate('admin', { session: false }), SMSController.getSMSPlanList);
router.put('/smsEmailPlans', passport.authenticate('admin', { session: false }), SMSController.updateSMSPlan);
router.delete('/smsEmailPlans/:id', passport.authenticate('admin', { session: false }), SMSController.deleteSMSPlan);

router.post('/notification', passport.authenticate('admin', { session: false }), NotificationsController.sendNotification);


// Currenry
router.post('/curreny', passport.authenticate('admin', { session: false }), CurrencyController.addCurrency);
router.get('/curreny', passport.authenticate('admin', { session: false }), CurrencyController.getCurrencyList);
router.put('/curreny', passport.authenticate('admin', { session: false }), CurrencyController.updateCurrency);
router.delete('/curreny/:id', passport.authenticate('admin', { session: false }), CurrencyController.deleteCurrency);

//dashboard 
router.get('/instituteCounts', passport.authenticate('admin', { session: false }), DashboardController.getInstituteCounts);
router.get('/smsCounts', passport.authenticate('admin', { session: false }), DashboardController.getSMSCounts);
router.get('/emailCounts', passport.authenticate('admin', { session: false }), DashboardController.getEmailCounts);
router.get('/expiredInstitutes', passport.authenticate('admin', { session: false }), DashboardController.getExpiredInstitutes);
router.get('/expiredInstitutesInWeek', passport.authenticate('admin', { session: false }), DashboardController.getExpiredInstitutesInWeek);
router.post('/totalRegistredStudents', passport.authenticate('admin', { session: false }), DashboardController.getTotalRegistredStudents);
router.post('/totalStudentIncome', passport.authenticate('admin', { session: false }), DashboardController.getTotalStudentIncome);
router.post('/totalInstitutePurchase', passport.authenticate('admin', { session: false }), DashboardController.getTotalInstitutePurchase);


//Email Template
router.post(  '/emailTemplate',                 passport.authenticate('admin', {session:false}), SuperAdminController.addEmailTemplate);
router.put(   '/emailTemplate',                 passport.authenticate('admin', {session:false}), SuperAdminController.editEmailTemplate);
router.get(   '/emailTemplate',                 passport.authenticate('admin', {session:false}), SuperAdminController.getTemplateList);
//========================= Super Admin Related All Services Module =========================
module.exports = router;