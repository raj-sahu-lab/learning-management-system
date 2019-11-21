import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { PaymentGateWayService } from './../RestApiCall/ApiHelper/payment-gate-way.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from './../RestApiCall/NetworkLayer/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subject-details',
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.css']
})
export class SubjectDetailsComponent implements OnInit, OnDestroy {

  subject: any;
  payPalPay: boolean = false;
  paymentType : any;
  coupon : any;
  offer : any;
  discountAmount : number = 0;
  discountMessage = '';
  discountSuccess = false;
  private subscription: Subscription;
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public paymentGateWayService: PaymentGateWayService, public router : Router, private toastr: ToastrService, public helperService: HelperService) { }

  ngOnInit() {
    this.subject = this.storage.get('subjectDetails');
    // console.log(this.subject);
    
  }

  checkLogin(){
    if(this.storage.get('isLogedIn')){
      let paymentSubjectModel: HTMLElement = document.getElementById('subSubsribe') as HTMLElement;
      if (paymentSubjectModel) {
        paymentSubjectModel.click();
      }
    } else {
      let paymentSubjectModelInfo: HTMLElement = document.getElementById('subSubsribeInfo') as HTMLElement;
      if (paymentSubjectModelInfo) {
        paymentSubjectModelInfo.click();
      }
    }
  }

  navigateToLogIn(page){
    let paymentSubjectModel: HTMLElement = document.getElementById('closeSubjectDetailsInfo') as HTMLElement;
    if (paymentSubjectModel) {
      paymentSubjectModel.click();
    }
    this.router.navigate(['/'+page]);
  }

  payementDetails(type: string, subjectDetails: any) {
    
    let details : any = {
      'type': type,
      'id': subjectDetails.id,
      'amount': subjectDetails.amount,
      'currency': subjectDetails.currency,
      'title': subjectDetails.title,
      'paymentGateWayid': subjectDetails.paymentgateway_id,
      'payementGateWayname': subjectDetails.payment_type.title,
      'key': subjectDetails.payment_type.key
    }
    if ((details.payementGateWayname == "PayPal") || (details.payementGateWayname == "Stripe")) {
      this.payPalPay = true;
    }
    this.paymentType = subjectDetails.payment_type.title;
    if(this.paymentType == 'Razorpay'){
      this.helperService.startLoader();
    }
    if(this.offer){
      details.offer = this.offer;
      details.afterDiscount = subjectDetails.amount - this.offer.discountAmount;
      details.beforeDiscount = subjectDetails.amount;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose() {
    if(this.paymentType == 'Razorpay'){
      this.helperService.stopLoader();
    }
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  afterPayment(paymentDetails) {
    this.payPalPay = false;
    this.coupon = undefined;
    this.offer = undefined;
    this.discountAmount = undefined;
    this.discountMessage = '';

    if(this.paymentType == 'Razorpay'){
      this.helperService.stopLoader();
    }
    this.payPalPay = false;
    let paymentSubjectModel: HTMLElement = document.getElementById('closeSubjectDetails') as HTMLElement;
    if (paymentSubjectModel) {
      paymentSubjectModel.click();
    }
    this.router.navigate(['/']);
    
  }

  navigateUrl(subject){
    if(!subject.isPaid || subject.purchase !=null){
      window.open(environment.redirectUrl);
      // window.open(environment.redirectUrl+'student/dashboard?token='+this.storage.get('student_token')+'&id='+subject.id);
    }
  }

  checkCoupon(){
    this.discountMessage = '';
    this.discountAmount = 0;
    this.offer = undefined;
    this.discountSuccess = false;

    const account = this.storage.get('account');
    const instituteId = account.account_id;

    const data = {
      "accountId" : instituteId,
      "subjectId" : this.subject.id,
      "couponCode" : this.coupon
    }
    
    this.subscription = this.paymentGateWayService.checkCoupon(data).subscribe((res : any) => {
      
      if (res && res.success) {
        if(res.data.currency.code == this.subject.currency.code){
          let couponData = res.data;
          if(this.subject.amount >= couponData.minBuyAmount){
            this.discountAmount = Math.round((this.subject.amount * (couponData.discount/100))*100)/100;
            
            if(this.discountAmount > couponData.maxAmount){
              this.toastr.success('Maximum discount amount '+ couponData.maxAmount + ' applied');
              this.discountMessage = 'Maximum discount amount '+ couponData.maxAmount + ' applied';
              this.discountAmount = couponData.maxAmount;
              this.discountSuccess = true;
            } else {
              this.discountMessage = 'Discount amount '+ this.discountAmount + ' applied';
              this.toastr.success('Discount amount '+ this.discountAmount + ' applied');
              this.discountSuccess = true;
            }
            this.offer = {
              "offerId" : couponData.id,
              "code" : couponData.code,
              "discountAmount" : this.discountAmount,
            }
          } else {
            this.discountMessage = "Minimum buy amount must be " + couponData.minBuyAmount;
            this.toastr.error("Minimum buy amount must be " + couponData.minBuyAmount);
          }
        }
      }
    },
      (err) => {
        this.discountMessage = err.error;
        this.toastr.error(err.error);
      });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
