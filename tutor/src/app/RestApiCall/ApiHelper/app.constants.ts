import { environment } from '../../../environments/environment';

function createUrl(actionName: string): string {
  return `${environment.baseUrl}institute/${actionName}`;
}

function createUrlNormal(actionName: string): string {
  return `${environment.baseUrl}${actionName}`;
}
export const appApiResources = {

  login: createUrl('user/login'),
  logout: createUrl('user/logout'),
  forGotPassword: createUrl('user/forGotPassword'),
  changePassword: createUrl('user/changePassword'), // forgot password
  checkOffer: createUrl('user/checkOffer'),
  purchasePlan: createUrl('user/purchasePlan'),
  getTermList: createUrl('user/termsAndPlan'),

  paymentGateWay : createUrl('paymentGateWay'), // Institute Payment Gateway
  paymentTitle : createUrl('paymentTitle'), // Master Payment Gateway
  // paymentgateway : createUrl('paymentGateWay'),
  defaultCurrency : createUrl('defaultCurrency'),
  
  dashboardStatistics : createUrl('dashboardStatistics'),
  currency : createUrl('currency'),
  space : createUrl('user/space'),
  subject : createUrl('courses/subject'),
  subjectandtopic : createUrl('courses/subjectAndTopic'),
  topic : createUrl('courses/topic'),
  content : createUrl('courses/content'),
  pdf : createUrl('courses/pdf'),
  ppt : createUrl('courses/ppt'),
  audio : createUrl('courses/audio'),
  video : createUrl('courses/video'),
  tutor : createUrl('tutor'),
  review : createUrl('review'),
  set : createUrl('test/set'),
  test : createUrl('test'),
  testresult : createUrl('test/result'),
  practice : createUrl('practice'),
  setting : createUrl('user'),
  polls : createUrl('communicate/poll'),
  forumCount : createUrl('communicate/forumCount'),
  forum : createUrl('communicate/forum'), // For all data used for selection common service
  forumCategory : createUrl('communicate/forumCategory'),
  forumSubject : createUrl('communicate/forumSubject'),
  forumTopic : createUrl('communicate/forumTopic'),
  forumArticles : createUrl('communicate/forumArticles'),
  articleDiscussion : createUrl('communicate/articleDiscussion'),
  articleDiscussionReplyDelete : createUrl('communicate/articleDiscussionReplyDelete'),
  notification : createUrl('notification'),
  branch : createUrl('branch'),
  zoomCredential : createUrl('liveClassApiKey'),
  aboutus : createUrl('user/about'),
  privacypolicies : createUrl('user/privacyPolices'),
  logo : createUrl('user/updateImage'),
  password : createUrl('user/updatePassword'), // tutor panel
  cancelSubscription : createUrl('user/cancelSubscription'),
  invoice : createUrl('user/invoice'),
  learner : createUrl('learner'),
  learnerActive : createUrl('learnerActive'),
  learnerbulkUpload : createUrl('learnerbulkUpload'),
  sms : createUrl('sms'),
  buySMS : createUrl('buySMS'),
  email : createUrl('email'),
  buyEmails : createUrl('buyEmails'),
  getSMSEMailPlans : createUrl('getSMSEMailPlans'),
  newsCategory : createUrl('newsCategory'),
  news : createUrl('news'),
  coupon : createUrl('coupon'),
  purchaseTypes : createUrl('purchase/types'),
  purchaseCourse : createUrl('purchase'),
  countryCityList : createUrlNormal('countryCityList'),
  education : createUrlNormal('education'),
  normalChat : createUrl('chatRoom'),
  tutorbyBranch : createUrl('tutorbyBranch'),
  assignTutor : createUrl('supportRequest/assign'),
  supportRequest : createUrl('supportRequest'),
  supportRequestChat : createUrl('supportRequestChat'),
  supportRequestChatRead : createUrl('supportRequestChatRead'),
  timeZone : createUrl('timeZone'),
  updateDomain : createUrl('updateDomain'),

  liveClassSignature :(environment.baseUrl+'liveClassSignature'), //https://api.example.com:3000/v1/liveClassSignature
  
  liveClass : createUrl('liveClass'),
  liveClassRecording : createUrl('liveClassRecording'),
  liveClassRecordingDownload : createUrl('liveClassRecordingDownload'),
  zoomLiveClass : createUrl('liveClassZoom'),
  blueJeansLiveClassUserCreate : createUrl('liveClass/user'),  
  zoomLiveClassUserCreate : createUrl('liveClass/userZoom'),
  liveClassGroup : createUrl('liveClass/group'),
  liveClassGroupStudent : createUrl('liveClass/group/student'),

  questionBundle: createUrl('bundleQuestion'),
  bundleQuestionByTypes: createUrl('bundleQuestionBytypes'),
  bundleSeries: createUrl('bundleSeries'),
  bundleSeriesAddQuestion : createUrl('bundleSeriesAddQuestion'),
  bundleSeriesRemoveQuestion : createUrl('bundleSeriesRemoveQuestion'),
  bundleSet : createUrl('bundleSet'),
  bundleSetRemoveSeries : createUrl('bundleSetRemoveSeries'),
  bundleSetAddSeries : createUrl('bundleSetAddSeries'),
  bundle : createUrl('bundle'),
  bundleAddSet : createUrl('bundleAddSet'),
  bundleRemoveSet : createUrl('bundleRemoveSet'),
  bundleCount : createUrl('bundleCount')

};
