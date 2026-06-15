const express = require('express');
const router = express.Router();

const AuthenticationController = require('../controllers/V1/Student/Authentication.controller');
const DashboardController = require('../controllers/V1/Student/Dashboard.controller');
const PollController = require('../controllers/V1/Student/Polls.controller');
const TestController = require('../controllers/V1/Student/Test.controller');
const FeedbackController = require('../controllers/V1/Student/Feedback.controller');
const ReviewController = require('../controllers/V1/Student/Review.controller');
const PurchaseController = require('../controllers/V1/Student/Purchase.controller');
const ForumController = require('../controllers/V1/Student/Forum.controller');
const ForumDiscussion = require('../controllers/V1/Student/Forum_Discussion.controller');
const SupportRequestController = require('../controllers/V1/Student/SupportRequest.controller');
const LiveClassesController = require('../controllers/V1/Student/LiveClasses.controller');
const LogController = require('../controllers/V1/Student/Log.controller');
const NewsController = require('../controllers/V1/Student/News.controller');
const TestBundleController = require('../controllers/V1/Student/TestBundle.controller');
const NotificationController 	= require('../controllers/V1/Student/Notification.controller');
const TutorController 	= require('../controllers/V1/Student/Tutor.controller');

const passport = require('passport');
const CONFIG = require('../config/config');
const CryptoJS = require("crypto-js");
const loginLimiter = require('../middleware/loginLimiter');
const {
  studentLoginValidation,
  studentRegisterValidation,
  forgotPasswordValidation,
  sendOTPValidation,
  verifyOTPValidation
} = require('../middleware/validators/authValidator');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: true, message: "This is Company Student Rest api.", data: { "version_number": "v1.0.0" } })
});


//========================= Student Related All Services Module =========================

router.post('/enc',             AuthenticationController.encryptData);

// const decryptPayload = function (req, res, next) {
    
//   if (req.fields.data) {
//       try {

//           var bytes = CryptoJS.AES.decrypt(req.fields.data, CONFIG.STUDENT_ENCRYPTION_KEY);
//           var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));            
//           req.fields = decryptedData;

//       } catch (e) {
//         req.fields = {};
//           // console.log(e);
//       }
//   } else {
//     req.fields = {};
//   }
//   next()
// }
// router.use(decryptPayload);

router.post('/login',           loginLimiter, studentLoginValidation, AuthenticationController.login);
router.put('/verify',           AuthenticationController.updateVerified);
router.post('/sendOTP',         sendOTPValidation, AuthenticationController.sendOTPForRegistration);
router.post('/verifyOTP',       verifyOTPValidation, AuthenticationController.verifyUserOTP);
router.post('/signup',          studentRegisterValidation, AuthenticationController.registerStudent);
router.post('/forGotPassword',  forgotPasswordValidation, AuthenticationController.forGotPasswordReset);
router.post('/updatePassword',  AuthenticationController.updatePassword);

router.get('/student',              passport.authenticate('student', { session: false }), AuthenticationController.getStudentProfile);

router.put('/student/:isShort*?',   passport.authenticate('student', { session: false }), AuthenticationController.updatePersonalInfo);
router.post('/picture',             passport.authenticate('student', { session: false }), AuthenticationController.changeProfilePicture);
router.post('/changePassword',      passport.authenticate('student', { session: false }), AuthenticationController.changePassword);

router.get('/logOut', passport.authenticate('student', { session: false }), AuthenticationController.logOutUser);
// Institute management

router.post('/setBranch',  passport.authenticate('student', { session: false }), AuthenticationController.registerStudentBranch);

router.get('/instituteList',          passport.authenticate('student', { session: false }), AuthenticationController.instituteList);
router.post('/institute',             passport.authenticate('student', { session: false }), AuthenticationController.addStudentInstitute);
router.get('/institute',              passport.authenticate('student', { session: false }), AuthenticationController.studentSelectedInstituteList);
router.post('/setDefaultInstitute',   passport.authenticate('student', { session: false }), AuthenticationController.studentDefaultInstitute);


router.get('/dashboard',              passport.authenticate('student', { session: false }), DashboardController.dashBordDetail);
router.post('/getTopicList',          passport.authenticate('student', { session: false }), DashboardController.getSubjectTopicList);
router.post('/getContentList',        passport.authenticate('student', { session: false }), DashboardController.getTopiContentList);
router.post('/getContentFileList',    passport.authenticate('student', { session: false }), DashboardController.getContentFilesList);


router.get('/reviewCourse',            passport.authenticate('student', { session: false }), DashboardController.getReviewSubjectList);

// Test
router.get('/test',     passport.authenticate('student', { session: false }), TestController.getTestList);
router.get('/test/:id', passport.authenticate('student', { session: false }), TestController.getTestQuestionList);
router.post('/test',    passport.authenticate('student', { session: false }), TestController.storeTestQuestionResult);
router.post('/test',    passport.authenticate('student', { session: false }), TestController.storeTestQuestionResult);

router.get('/testResult',     passport.authenticate('student', { session: false }), TestController.getTestResultList);
router.get('/testResult/:id', passport.authenticate('student', { session: false }), TestController.getRestResult);

// Practice
router.get('/practice/:id', passport.authenticate('student', { session: false }), TestController.getPracticeQuestionList);

// Poll
router.get('/poll',       passport.authenticate('student', { session: false }), PollController.PollList);
router.get('/poll/:id',   passport.authenticate('student', { session: false }), PollController.GetPoll);
router.post('/poll',      passport.authenticate('student', { session: false }), PollController.saveStudentPollAnswer);


router.get('/forumDashboard',     passport.authenticate('student', { session: false }), ForumController.getForumDashBoard);
router.get('/forumSubject/:id',   passport.authenticate('student', { session: false }), ForumController.getForumSubjectList);
router.get('/forumTopic/:id',     passport.authenticate('student', { session: false }), ForumController.getForumTopicList);
router.get('/forumArticles/:id',  passport.authenticate('student', { session: false }), ForumController.getForumArticlesList);
router.get('/forumArticle/:id',   passport.authenticate('student', { session: false }), ForumController.getForumArticle);

router.post('/forumDiscussion',       passport.authenticate('student', { session: false }), ForumDiscussion.addForumDiscussionMessage);
router.post('/forumDiscussion/:id',   passport.authenticate('student', { session: false }), ForumDiscussion.getForumDiscussionMessageList);
router.post('/forumDiscussionReply',  passport.authenticate('student', { session: false }), ForumDiscussion.addForumDiscussionMessageReplay);



router.post('/feedBack',  passport.authenticate('student', { session: false }), FeedbackController.saveFeedback);

router.get('/review',   passport.authenticate('student', { session: false }), ReviewController.reviewList);
router.post('/review',  passport.authenticate('student', { session: false }), ReviewController.addReview);

router.post('/purchase',    passport.authenticate('student', { session: false }), PurchaseController.addPurchase);
router.get('/purchase',     passport.authenticate('student', { session: false }), PurchaseController.purchaseList);
router.post('/checkCoupon', passport.authenticate('student', {session:false}), PurchaseController.verifyCouponcode);
router.post('/stripePurchase',    passport.authenticate('student', { session: false }), PurchaseController.addStripePurchase);
router.post('/stripeAndroidPaymentIntent',    passport.authenticate('student', { session: false }), PurchaseController.addStripeAndroidPurchase);

router.post('/supportRequest',    passport.authenticate('student', { session: false }), SupportRequestController.addSupportRequest);
router.get('/supportRequest',     passport.authenticate('student', { session: false }), SupportRequestController.getSupportRequestList);
router.get('/supportRequest/:id', passport.authenticate('student', { session: false }), SupportRequestController.getSupportRequest);

router.post('/supportRequestChat',      passport.authenticate('student', { session: false }), SupportRequestController.addSupportRequestMessage);
router.post('/supportRequestChat/:id',  passport.authenticate('student', { session: false }), SupportRequestController.getSupportRequestMessageList);
router.post('/supportRequestChatRead',  passport.authenticate('student', { session: false }), SupportRequestController.updateSupportRequestRead);

router.get('/liveClass', passport.authenticate('student', { session: false }), LiveClassesController.getLiveClassList);
router.get('/zoomKey', passport.authenticate('student', { session: false }), LiveClassesController.getLiveClassKey);

router.get('/STCTtypesList', passport.authenticate('student', { session: false }), SupportRequestController.getAllType);

// router.post(   '/purchase/:id',   decryptPayload , passport.authenticate('student', {session:false}), PurchaseController.addPurchaseMileStone);

router.get('/aboutUs',          passport.authenticate('student', { session: false }), ReviewController.getAboutUs);
router.get('/privacyPolicies',  passport.authenticate('student', { session: false }), ReviewController.getPrivacyPolices);

router.post('/video-log',   passport.authenticate('student', { session: false }), LogController.addUpdateVideoLog);
router.post('/audio-log',   passport.authenticate('student', { session: false }), LogController.addUpdateAudioLog);
router.post('/pdf-log',     passport.authenticate('student', { session: false }), LogController.addUpdatePDFLog);


router.get('/newsCategory', passport.authenticate('student', { session: false }), NewsController.getNewsCategoryList);
router.post('/news',        passport.authenticate('student', { session: false }), NewsController.getNewsList);


router.get('/bundle/:page/:limit',      passport.authenticate('student', { session: false }), TestBundleController.getBundleList);

router.get('/bundleSet/:bundleId/:page/:limit',         passport.authenticate('student', { session:false }), TestBundleController.getBundleSetList);
router.get('/bundleSeries/:setId/:page/:limit',         passport.authenticate('student', { session:false }), TestBundleController.getBundleSeriesList);
router.get('/bundleQuestion/:seriesId/:page/:limit',    passport.authenticate('student', { session:false }), TestBundleController.getBundleQuestionList);

router.post('/bundle',                passport.authenticate('student', { session:false }), TestBundleController.saveTestBundleSeriesResult);
router.get('/bundleResult/:id*?',     passport.authenticate('student', { session:false }), TestBundleController.getBundleResultList);

router.get('/notification',          passport.authenticate('student', { session:false }), NotificationController.getNotificationList);

router.get('/tutor',          passport.authenticate('student', { session:false }), TutorController.getTutorList);

//========================= Student Related All Services Module =========================

module.exports = router;