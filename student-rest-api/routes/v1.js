const express = require('express');
const router = express.Router();

const UserController = require('../controllers/V1/Institute/user.controller')
const PaymentGateWayController = require('../controllers/V1/Institute/paymentgateway.controller');
const ReportController = require('../controllers/V1/Institute/report.controller');
const CoursesController = require('../controllers/V1/Institute/courses.controller');
const TestController = require('../controllers/V1/Institute/test.controller');
const TutorController = require('../controllers/V1/Institute/tutor.controller');
const AboutPrivacyController = require('../controllers/V1/Institute/privacyAndAbout.controller');
const BranchController = require('../controllers/V1/Institute/branch.controller');
const PollController = require('../controllers/V1/Institute/polls.controller');
const ForumController = require('../controllers/V1/Institute/forum.controller');
const LearnerController = require('../controllers/V1/Institute/learner.controller');
const MarketingController = require('../controllers/V1/Institute/marketing.controller');
const NewsController = require('../controllers/V1/Institute/news.controller');
const CouponController = require('../controllers/V1/Institute/coupon.controller');
const PurchaseController = require('../controllers/V1/Institute/CourcePurchase.controller');
const SupportRequestController = require('../controllers/V1/Institute/SupportRequest.controller');
const LiveClassesController = require('../controllers/V1/Institute/LiveClasses.controller');
const TestBundleController = require('../controllers/V1/Institute/TestBundle.controller');
const NotificationController = require('../controllers/V1/Institute/Notification.controller');
const ServicesController = require('../controllers/V1/Institute/Services.controller');
const FilterByDate = require('../controllers/V1/Institute/filterByDate.controller');
const chatController = require('../controllers/V1/Institute/chat.controller');
const reviewController = require('../controllers/V1/Institute/review.controller');

const passport = require('passport');
const path = require('path');

const CONFIG = require('../config/config');
const CryptoJS = require("crypto-js");


require('../controllers/V1/CronJob.controller');
require('./../middleware/passport')(passport)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: true, message: "This is Company Rest api.", data: { "version_number": "v1.0.0" } })
});

//========================= Institute Related All Services Module =========================

const decryptPayload = function (req, res, next) {

  if (req.fields.data) {
    try {

      var bytes = CryptoJS.AES.decrypt(req.fields.data, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      req.fields = decryptedData;

    } catch (e) {
      req.fields = {};
      // console.log(e);
    }
  } else {
    req.fields = {};
  }
  next()
}
// router.use(decryptPayload);

router.post('/user/login', UserController.login);
router.get('/user/logout', passport.authenticate('jwt', { session: false }), UserController.logout);
router.get('/user', passport.authenticate('jwt', { session: false }), UserController.getUser);
router.put('/user/updateImage', passport.authenticate('jwt', { session: false }), UserController.updateAccountImage);
router.put('/user/updatePassword', passport.authenticate('jwt', { session: false }), UserController.chnagePassword);
router.put('/user/changePassword', passport.authenticate('withoutDeviceInstitute', { session: false }), UserController.updatePassword);

router.get('/user/space', passport.authenticate('jwt', { session: false }), UserController.getUsedSpace);

router.get('/user/invoice', passport.authenticate('jwt', { session: false }), UserController.getPurchasedPlanList);

router.post('/user/forGotPassword', UserController.forGotPasswordReset);

router.get('/permissions', passport.authenticate('jwt', { session: false }), UserController.getPermissionsList);
router.put('/timeZone', passport.authenticate('jwt', { session: false }), UserController.updateTimeZone);
router.put('/defaultCurrency', passport.authenticate('jwt', { session: false }), UserController.updateCurrency);
router.put('/updateDomain', passport.authenticate('jwt', { session: false }), UserController.updateDomain);

// Privacy Policies
router.post('/user/privacyPolices', passport.authenticate('jwt', { session: false }), AboutPrivacyController.addPrivacyPolicies);
router.get('/user/privacyPolices', passport.authenticate('jwt', { session: false }), AboutPrivacyController.getPrivacyPolicies);
router.put('/user/privacyPolices', passport.authenticate('jwt', { session: false }), AboutPrivacyController.updatePrivacyPolicies);
// router.delete(  '/user/privacyPolices/:id',   passport.authenticate('jwt', {session:false}),    AboutPrivacyController.deletePrivacyPolicies);

// About
router.post('/user/about', passport.authenticate('jwt', { session: false }), AboutPrivacyController.addAboutUs);
router.get('/user/about', passport.authenticate('jwt', { session: false }), AboutPrivacyController.getAboutUs);
router.put('/user/about', passport.authenticate('jwt', { session: false }), AboutPrivacyController.updateAboutUs);
// router.delete(  '/user/about/:id',   passport.authenticate('jwt', {session:false}),    AboutPrivacyController.deleteAboutUs);


// Check And Purchase Plans
router.get('/user/termsAndPlan', passport.authenticate('withoutDeviceInstitute', { session: false }), UserController.getTermsAndPlanList);
router.post('/user/checkOffer', UserController.checkAccountOffer);
router.post('/user/purchasePlan', passport.authenticate('withoutDeviceInstitute', { session: false }), UserController.purchasePlan);

router.get('/user/cancelSubscription', passport.authenticate('withoutDeviceInstitute', { session: false }), UserController.cancelSubscription);

//Payment Module START
router.get('/paymentTitle', passport.authenticate('jwt', { session: false }), PaymentGateWayController.getAllGateWaysTitleList);

router.get('/paymentGateWay', passport.authenticate('jwt', { session: false }), PaymentGateWayController.getAllGateWays);
router.post('/paymentGateWay', passport.authenticate('jwt', { session: false }), PaymentGateWayController.addPaymentGateWay);
router.put('/paymentGateWay', passport.authenticate('jwt', { session: false }), PaymentGateWayController.editPaymentGateWay);

//Payment Module END

//Branch Module START
router.get('/branch/:isFiltered*?', passport.authenticate('jwt', { session: false }), BranchController.getBranchList);
router.post('/branch', passport.authenticate('jwt', { session: false }), BranchController.addBranch);
router.put('/branch', passport.authenticate('jwt', { session: false }), BranchController.updateBranch);
router.delete('/branch/:id', passport.authenticate('jwt', { session: false }), BranchController.deleteBranch);
//Branch Module END

// DashBoard Data
router.get('/dashboardStatistics', passport.authenticate('jwt', { session: false }), FilterByDate.getDataByDate);
router.get('/questionsCount', passport.authenticate('jwt', { session: false }), TestController.testQuestionCount);
router.post('/dashboardStatistics', passport.authenticate('jwt', { session: false }), FilterByDate.dataForChart);

// End DashBoard Data


// -----------------------------------------------------------
//Courses Module START

//  1.Subject
router.post('/courses/subject', passport.authenticate('jwt', { session: false }), CoursesController.createSubject);
router.get('/courses/subject', passport.authenticate('jwt', { session: false }), CoursesController.getAvailableSubject);
router.put('/courses/subject', passport.authenticate('jwt', { session: false }), CoursesController.updateSubject);
router.delete('/courses/subject/:id', passport.authenticate('jwt', { session: false }), CoursesController.deleteSubject);


//  2.Topic
router.post('/courses/topic', passport.authenticate('jwt', { session: false }), CoursesController.createTopic);
router.get('/courses/topic', passport.authenticate('jwt', { session: false }), CoursesController.getAvailableTopic);
router.put('/courses/topic', passport.authenticate('jwt', { session: false }), CoursesController.updateTopic);
router.delete('/courses/topic/:id', passport.authenticate('jwt', { session: false }), CoursesController.deleteTopic);

//  3.Tutor
router.post('/tutor', passport.authenticate('jwt', { session: false }), TutorController.addTutor);
router.get('/tutor/:isFiltered', passport.authenticate('jwt', { session: false }), TutorController.getTutorList);
router.put('/tutor', passport.authenticate('jwt', { session: false }), TutorController.updateTutor);
router.delete('/tutor/:id', passport.authenticate('jwt', { session: false }), TutorController.deleteTutor);
router.get('/tutorbyBranch/:branchId', passport.authenticate('jwt', { session: false }), TutorController.getTutorListByBranch);

//  4.Content
router.post('/courses/content', passport.authenticate('jwt', { session: false }), CoursesController.addContent);
router.put('/courses/content', passport.authenticate('jwt', { session: false }), CoursesController.updateContent);
router.get('/courses/content', passport.authenticate('jwt', { session: false }), CoursesController.getContentList);
router.delete('/courses/content/:id', passport.authenticate('jwt', { session: false }), CoursesController.deleteContent);

//  5.PDF
router.get('/courses/pdf', passport.authenticate('jwt', { session: false }), CoursesController.getPDFList);
router.post('/courses/pdf', passport.authenticate('jwt', { session: false }), CoursesController.addPDF);
router.put('/courses/pdf', passport.authenticate('jwt', { session: false }), CoursesController.updatePDF);
router.delete('/courses/pdf/:id', passport.authenticate('jwt', { session: false }), CoursesController.deletePDF);


//  6.PPT
router.get('/courses/ppt', passport.authenticate('jwt', { session: false }), CoursesController.getPPTList);
router.post('/courses/ppt', passport.authenticate('jwt', { session: false }), CoursesController.addPPT);
router.put('/courses/ppt', passport.authenticate('jwt', { session: false }), CoursesController.updatePPT);
router.delete('/courses/ppt/:id', passport.authenticate('jwt', { session: false }), CoursesController.deletePPT);

//  7.Audio
router.get('/courses/audio', passport.authenticate('jwt', { session: false }), CoursesController.getAudioList);
router.post('/courses/audio', passport.authenticate('jwt', { session: false }), CoursesController.addAudio);
router.put('/courses/audio', passport.authenticate('jwt', { session: false }), CoursesController.updateAudio);
router.delete('/courses/audio/:id', passport.authenticate('jwt', { session: false }), CoursesController.deleteAudio);

//  8.Video
router.get('/courses/video', passport.authenticate('jwt', { session: false }), CoursesController.getVideoList);
router.post('/courses/video', passport.authenticate('jwt', { session: false }), CoursesController.addVideo);
router.put('/courses/video', passport.authenticate('jwt', { session: false }), CoursesController.updateVideo);
router.delete('/courses/video/:id', passport.authenticate('jwt', { session: false }), CoursesController.deleteVideo);

router.post('/courses/videoProcessingStatus', CoursesController.videoProcessingStatus);

//  9.Set
// router.get(     '/test/set',        passport.authenticate('jwt', {session:false}), TestController.getSetList);
// router.post(    '/test/set',        passport.authenticate('jwt', {session:false}), TestController.createSet);
// router.put(     '/test/set',        passport.authenticate('jwt', {session:false}), TestController.updateSet);
// router.delete(  '/test/set/:id',    passport.authenticate('jwt', {session:false}), TestController.deleteSet);

//  10.Test
router.get('/test', passport.authenticate('jwt', { session: false }), TestController.getTestList);
router.post('/test', passport.authenticate('jwt', { session: false }), TestController.addNewTest);
// router.put(     '/test',        passport.authenticate('jwt', {session:false}), TestController.updateSet);
router.delete('/test/:id', passport.authenticate('jwt', { session: false }), TestController.deleteTest);


router.get('/test/result', passport.authenticate('jwt', { session: false }), TestController.getStudentTestResultList);
router.get('/test/result/:id/:studentId', passport.authenticate('jwt', { session: false }), TestController.getTestResult);

//  10.Practice
router.get('/practice', passport.authenticate('jwt', { session: false }), TestController.getPracticeList);
router.post('/practice', passport.authenticate('jwt', { session: false }), TestController.addPracticeQuestion);
// router.put(     '/test',        passport.authenticate('jwt', {session:false}), TestController.updateSet);
router.delete('/practice/:id', passport.authenticate('jwt', { session: false }), TestController.deletePractice);



// 11. Polls
router.post('/communicate/poll', passport.authenticate('jwt', { session: false }), PollController.addNewPoll);
router.get('/communicate/poll', passport.authenticate('jwt', { session: false }), PollController.getPollList);
router.get('/communicate/poll/:id', passport.authenticate('jwt', { session: false }), PollController.GetPollResult);
router.delete('/communicate/poll/:id', passport.authenticate('jwt', { session: false }), PollController.deletePoll);

//11. Forum
router.get('/communicate/forumCount', passport.authenticate('jwt', { session: false }), ForumController.getForumCount);
router.get('/communicate/forum', passport.authenticate('jwt', { session: false }), ForumController.getForumList);

// 11.1 Forum Category
router.post('/communicate/forumCategory', passport.authenticate('jwt', { session: false }), ForumController.addForumCategory);
router.get('/communicate/forumCategory', passport.authenticate('jwt', { session: false }), ForumController.getForumCategoryList);
router.put('/communicate/forumCategory', passport.authenticate('jwt', { session: false }), ForumController.updateForumCategory);
router.delete('/communicate/forumCategory/:id', passport.authenticate('jwt', { session: false }), ForumController.deleteForumCategory);

// 11.2 Forum Subject
router.post('/communicate/forumSubject', passport.authenticate('jwt', { session: false }), ForumController.addForumSubject);
router.get('/communicate/forumSubject', passport.authenticate('jwt', { session: false }), ForumController.getForumSubjectList);
router.put('/communicate/forumSubject', passport.authenticate('jwt', { session: false }), ForumController.updateForumSubject);
router.delete('/communicate/forumSubject/:id', passport.authenticate('jwt', { session: false }), ForumController.deleteForumSubject);

// 11.3 Forum Topic
router.post('/communicate/forumTopic', passport.authenticate('jwt', { session: false }), ForumController.addForumTopic);
router.get('/communicate/forumTopic', passport.authenticate('jwt', { session: false }), ForumController.getForumTopicList);
router.put('/communicate/forumTopic', passport.authenticate('jwt', { session: false }), ForumController.updateForumTopic);
router.delete('/communicate/forumTopic/:id', passport.authenticate('jwt', { session: false }), ForumController.deleteForumTopic);

// 11.4 Forum Articles
router.post('/communicate/forumArticles', passport.authenticate('jwt', { session: false }), ForumController.addForumArticles);
router.get('/communicate/forumArticles', passport.authenticate('jwt', { session: false }), ForumController.getForumArticlesList);
router.put('/communicate/forumArticles', passport.authenticate('jwt', { session: false }), ForumController.updateForumArticles);
router.delete('/communicate/forumArticles/:id', passport.authenticate('jwt', { session: false }), ForumController.deleteForumArticles);

router.post('/communicate/articleDiscussion', passport.authenticate('jwt', { session: false }), ForumController.getArticleDiscussion);

router.delete('/communicate/deleteArticleDiscussionReply/:id', passport.authenticate('jwt', { session: false }), ForumController.deleteArticleDiscussionReply);


// 12.Learner
router.post('/learner', passport.authenticate('jwt', { session: false }), LearnerController.addLearner);
router.get('/learner/:isFiltered?/:purchaseType?/:purchaseId?', passport.authenticate('jwt', { session: false }), LearnerController.getLearnerList);
router.put('/learner', passport.authenticate('jwt', { session: false }), LearnerController.updateLearner);
router.delete('/learner/:id', passport.authenticate('jwt', { session: false }), LearnerController.deleteLearner);
router.post('/learnerActive', passport.authenticate('jwt', { session: false }), LearnerController.activeDeactiveLearner);
router.post('/learnerbulkUpload', passport.authenticate('jwt', { session: false }), LearnerController.bulkStudnetAdd);

// 13. Marketing
router.post('/sms', passport.authenticate('jwt', { session: false }), MarketingController.sendSMSTOLearner);
router.post('/email', passport.authenticate('jwt', { session: false }), MarketingController.createCampaignForStudent);
router.get('/email', passport.authenticate('jwt', { session: false }), MarketingController.getAllCampaignList);
router.get('/email/:id', passport.authenticate('jwt', { session: false }), MarketingController.getCampaignReport);


// 14.News Category
router.post('/newsCategory', passport.authenticate('jwt', { session: false }), NewsController.addNewsCategory);
router.get('/newsCategory/:isSelection*?', passport.authenticate('jwt', { session: false }), NewsController.getNewsCategoryList);
router.put('/newsCategory', passport.authenticate('jwt', { session: false }), NewsController.updateNewsCategory);
router.delete('/newsCategory/:id', passport.authenticate('jwt', { session: false }), NewsController.deleteNewsCategory);

// 15.News
router.post('/news', passport.authenticate('jwt', { session: false }), NewsController.addNews);
router.get('/news', passport.authenticate('jwt', { session: false }), NewsController.getNewsList);
router.put('/news', passport.authenticate('jwt', { session: false }), NewsController.updateNews);
router.delete('/news/:id', passport.authenticate('jwt', { session: false }), NewsController.deleteNews);

// 16.Coupon
router.post('/coupon', passport.authenticate('jwt', { session: false }), CouponController.addCoupon);
router.get('/coupon', passport.authenticate('jwt', { session: false }), CouponController.getCouponList);
router.put('/coupon', passport.authenticate('jwt', { session: false }), CouponController.updateCoupon);
router.delete('/coupon/:id', passport.authenticate('jwt', { session: false }), CouponController.deleteCoupon);

// 17. Purchase
router.get('/purchase/types/:id*?', passport.authenticate('jwt', { session: false }), PurchaseController.getAllType);
router.post('/purchase', passport.authenticate('jwt', { session: false }), PurchaseController.addPurchase);
router.get('/purchase', passport.authenticate('jwt', { session: false }), PurchaseController.getPurchaseList);

// router.get(  '/purchase/:studentId',           passport.authenticate('jwt', {session:false}), PurchaseController.getPurchaseList);


// Support Request
router.get('/supportRequest', passport.authenticate('jwt', { session: false }), SupportRequestController.getSupportRequestList);
router.get('/supportRequest/:id', passport.authenticate('jwt', { session: false }), SupportRequestController.getSupportRequest);
router.put('/supportRequest/:supportRequestId', passport.authenticate('jwt', { session: false }), SupportRequestController.closeSupportRequest);
router.delete('/supportRequest/:supportRequestId', passport.authenticate('jwt', { session: false }), SupportRequestController.deleteSupportRequest);

// Support Request Assign
router.post('/supportRequest/assign', passport.authenticate('jwt', { session: false }), SupportRequestController.assignSupportRequestToTutor);
router.post('/supportRequestChat', passport.authenticate('jwt', { session: false }), SupportRequestController.addSupportRequestMessage);
router.post('/supportRequestChat/:id', passport.authenticate('jwt', { session: false }), SupportRequestController.getSupportRequestMessageList);
router.delete('/supportRequestChat/:id', passport.authenticate('jwt', { session: false }), SupportRequestController.deleteSupportRequestMessage);
router.post('/supportRequestChatRead', passport.authenticate('jwt', { session: false }), SupportRequestController.updateSupportRequestRead);

// Socket chat
router.get('/chatRoom', passport.authenticate('jwt', { session: false }), chatController.getChatList);

// Live Classes
router.get('/liveClass', passport.authenticate('jwt', { session: false }), LiveClassesController.getLiveClassList);
router.post('/liveClass', passport.authenticate('jwt', { session: false }), LiveClassesController.createLiveClass);
router.delete('/liveClass/:id', passport.authenticate('jwt', { session: false }), LiveClassesController.deleteLiveClass);

router.post(     '/liveClass/user',          passport.authenticate('jwt', { session:false }), LiveClassesController.createUserLiveClassblueJence);
router.get(      '/liveClass/user',          passport.authenticate('jwt', { session:false }), LiveClassesController.getBlueJeanceUserList);

router.get(      '/liveClassRecording/:userId/:meetingId',            passport.authenticate('jwt', { session:false }), LiveClassesController.GetRecoringList);
router.get(      '/liveClassRecordingDownload/:userId/:contentId',    passport.authenticate('jwt', { session:false }), LiveClassesController.GetRecoringDownloadLink);
router.get(      '/liveClassRecordingTutor/:userId',                  passport.authenticate('jwt', { session:false }), LiveClassesController.GetTutorRecoringList);

router.get(      '/liveClassTutorPastMeeting/:userId',                passport.authenticate('jwt', { session:false }), LiveClassesController.GetTutorPastMeetingList);

// router.delete(   '/liveClass/user/:id',      passport.authenticate('jwt', { session:false }), LiveClassesController.deleteUserFromBlueJeance);

//Live Class Zoom
router.post('/liveClassZoom', passport.authenticate('jwt', { session: false }), LiveClassesController.createZoomLiveClass);
router.post('/liveClassApiKey', passport.authenticate('jwt', { session: false }), LiveClassesController.addLiveClassKey);
router.put('/liveClassApiKey', passport.authenticate('jwt', { session: false }), LiveClassesController.updateLiveClassKey);
router.get('/liveClassApiKey', passport.authenticate('jwt', { session: false }), LiveClassesController.getLiveClassKey);

// Zoom user 
router.post('/liveClass/userZoom', passport.authenticate('jwt', { session: false }), LiveClassesController.createUserLiveClassZoom);
router.get('/liveClass/userZoom', passport.authenticate('jwt', { session: false }), LiveClassesController.getUserLiveClassZoom);
// Zoom user

// Get Subject and related Topic
router.get('/courses/subjectAndTopic', passport.authenticate('jwt', { session: false }), CoursesController.getSubjectTopic);
router.get('/currency', passport.authenticate('jwt', { session: false }), CoursesController.getCurrencyList);


//Courses Module END
// -----------------------------------------------------------
//Report Module
router.get('/report/admission', passport.authenticate('jwt', { session: false }), ReportController.getAllAdmission);
router.get('/review', passport.authenticate('jwt', { session: false }), reviewController.reviewList);


// Test Bundle
router.get('/bundleCount', passport.authenticate('jwt', { session: false }), TestBundleController.bundleCounts);

router.post('/bundleQuestion', passport.authenticate('jwt', { session: false }), TestBundleController.addBundleQuestion);
router.get('/bundleQuestion/:page/:limit/:type*?', passport.authenticate('jwt', { session: false }), TestBundleController.getBundleQuestionList);
router.delete('/bundleQuestion/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteBundleQuestion);

router.post('/bundleQuestionBytypes/:page/:limit', passport.authenticate('jwt', { session: false }), TestBundleController.getQuestionListBySelectedTypes);

router.post('/bundleSeries', passport.authenticate('jwt', { session: false }), TestBundleController.createBundleQuestionSeries);
router.get('/bundleSeries/:page/:limit', passport.authenticate('jwt', { session: false }), TestBundleController.getBundleSeriesList);
router.delete('/bundleSeries/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteBundleSeries);

router.post('/bundleSeriesAddQuestion', passport.authenticate('jwt', { session: false }), TestBundleController.addQuestionsToSeries);
router.delete('/bundleSeriesRemoveQuestion/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteBundleSeriesQuestion);

router.post('/bundleSet', passport.authenticate('jwt', { session: false }), TestBundleController.createBundleSeriesSet);
router.get('/bundleSet/:page/:limit', passport.authenticate('jwt', { session: false }), TestBundleController.getSetSeriesList);
router.delete('/bundleSet/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteSet);

router.post('/bundleSetAddSeries', passport.authenticate('jwt', { session: false }), TestBundleController.addSeriesToSet);
router.delete('/bundleSetRemoveSeries/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteSeriesFromSet);

router.post('/bundle', passport.authenticate('jwt', { session: false }), TestBundleController.createBundle);
router.put('/bundle/:id', passport.authenticate('jwt', { session: false }), TestBundleController.updateBundle);
router.get('/bundle/:page/:limit', passport.authenticate('jwt', { session: false }), TestBundleController.getBundleList);
router.delete('/bundle/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteBundle);

router.post('/bundleAddSet', passport.authenticate('jwt', { session: false }), TestBundleController.addSetToBundle);
router.delete('/bundleRemoveSet/:id', passport.authenticate('jwt', { session: false }), TestBundleController.deleteSetFromBundle);


// Notifications 
router.post('/notification', passport.authenticate('jwt', { session: false }), NotificationController.sendNotification);
router.get('/notification', passport.authenticate('jwt', { session: false }), NotificationController.getNotificationList);


// SMS And Emaid Buy and plan list
router.get('/getSMSEMailPlans/:type', passport.authenticate('jwt', { session: false }), ServicesController.getSMSEmailPlans);
router.post('/buySMS', passport.authenticate('jwt', { session: false }), ServicesController.buySMSCredit);
router.post('/buyEmails', passport.authenticate('jwt', { session: false }), ServicesController.buyEmailCredit);


//Live classes group
router.post('/liveClass/group', passport.authenticate('jwt', { session: false }), LiveClassesController.createLiveclassesGroup);
router.get('/liveClass/group', passport.authenticate('jwt', { session: false }), LiveClassesController.getLiveclassGroupsList);
router.post('/liveClass/group/student', passport.authenticate('jwt', { session: false }), LiveClassesController.addStudentsToGroup);
router.put('/liveClass/group/student', passport.authenticate('jwt', { session: false }), LiveClassesController.removeStudentsFromGroup);

//========================= Institute Related All Services Module =========================


router.get('/chargebeePaymentTest', MarketingController.chargebeePaymentTest);



//********* API DOCUMENTATION **********

// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerDocument));

router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
