import { environment } from './environemnt';

function createUrl(actionName: string): string {
  return `${environment.baseUrl}${actionName}`;
}

export const appApiResources = {

  instituteCounts: createUrl('admin/instituteCounts'),
  smsCounts: createUrl('admin/smsCounts'),
  emailCounts: createUrl('admin/emailCounts'),
  expiredInstitute: createUrl('admin/expiredInstitutes'),
  expiredInstitutesInWeek: createUrl('admin/expiredInstitutesInWeek'),
  totalRegistredStudents: createUrl('admin/totalRegistredStudents'),
  totalStudentIncome: createUrl('admin/totalStudentIncome'),
  totalInstitutePurchase: createUrl('admin/totalInstitutePurchase'),
  password: createUrl('admin/updatePassword'),
  institute: createUrl('admin/users'),
  enableLink: createUrl('admin/enableLink'),
  instituteCreate: createUrl('admin/users/create'),
  education: createUrl('admin/education'),
  curreny: createUrl('admin/curreny'),
  login: createUrl('admin/login'),
  term: createUrl('admin/term'),
  termsandplan: createUrl('admin/termsAndPlan'),
  plan: createUrl('admin/plan'),
  plandetail: createUrl('admin/plandetail'),
  smsEmailPlans: createUrl('admin/smsEmailPlans'),
  sms: createUrl('admin/addSMS'),
  sendSMS: createUrl('admin/sendSMS'),
  smshistory: createUrl('admin/getSMSList'),
  email: createUrl('admin/addEmail'),
  emailhistory: createUrl('admin/getEmailList'),
  emailTemplate: createUrl('admin/emailTemplate'),
  offer: createUrl('admin/offer'),
  notification: createUrl('admin/notification'),
  countryCityList : createUrl('countryCityList'),
  menu : createUrl('admin/menu'),
  submenu : createUrl('admin/menuSub'),
  menusubmenu : createUrl('admin/menuSubMenu'),
  tutorList : createUrl('admin/tutorList'),
  studentList : createUrl('admin/studentList'),
  inAppPurchase : createUrl('admin/inAppPurchase')
};
