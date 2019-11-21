import { environment } from '../../../environments/environment';

function createUrl(actionName: string): string {
  return `${environment.apiUrl}${actionName}`;
}

export const appApiResources = {

  home: createUrl('website/home'),
  login: createUrl('website/login'),
  about: createUrl('website/about'),
  contact: createUrl('website/contact'),
  purchase: createUrl('website/purchase'),
  stripePurchase: createUrl('website/stripePurchase'),
  checkCoupon : createUrl('website/checkCoupon'),

  sendOTP : createUrl('website/sendOTP'),
  verifyOTP : createUrl('website/verifyOTP'),
  register : createUrl('website/signup'),
  setBranch : createUrl('website/setBranch'),
  terms: createUrl('website/terms'),
  privacy: createUrl('website/privacyPolicy')
  
};