import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { SubjectApiHelper } from './../../RestApiCall/ApiHelper/subject.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
declare var $ :any;
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { ToastrService } from 'ngx-toastr';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit, OnDestroy {

  subjectList: any;
  topicTitle = '';
  topicPreview = '';
  topicAmount = null;
  topicCurrency : any;

  subjectId = '';
  payPalPay: boolean = false;
  topicId: any;
  topicGateWayId: number;
  paymentGateWayName: any;
  topicKey: any;
  redirectId: any;
  institute : any;
  coupon : any;
  offer : any;
  discountAmount : number = 0;
  discountMessage = '';
  discountSuccess = false;
  private subscriptions: Subscription[] = [];
  defaultImage = environment.baseUrl + "assets/img/icons/default_profile_small.png";

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private toastr: ToastrService, public redirectionService: RedirectionService, public router: Router, private route: ActivatedRoute, protected serviceSubject: SubjectApiHelper, public paymentGateWayService : PaymentGateWayService, private location: Location, public helperService: HelperService) {
    // this.subjectId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getDashBoardToSub().subscribe(id =>{
      this.subjectId = id;
    }));
    if(!this.subjectId){
      if(this.storage.get('subjectId')){
        this.subjectId = this.storage.get('subjectId');
      }
    }
  }

  ngOnInit() {
    this.subjectDetails();
    const user = this.storage.get('User');
    this.institute = user.branch;
  }

  goBack(){
    this.location.back();
  }

  subjectDetails() {
    let subjectData: { [k: string]: any } = {

      subjectId: this.subjectId,
    };

    this.subscriptions.push(this.serviceSubject.getSubjectDetails(subjectData).subscribe((res: ServerResponse) => {
      // this.helperService.stopLoad();
      
      if (res.success && res.data != null) {

        this.subjectList = res.data;
        if(this.subjectList.purchase){
          if(this.subjectList.purchase.remainHours){
            this.subjectList.purchase.remainTime = this.hoursminute(this.subjectList.purchase.remainHours);
          }
        }
        this.subjectList.topics.forEach(topic => {
          if(topic.purchase){
            if(topic.purchase.remainHours){
              topic.purchase.remainTime = this.hoursminute(topic.purchase.remainHours);
            }
          }
        });
      }
    },
      (err) => {
        // this.helperService.stopLoad();
        this.toastr.error(err.error);
      }));
  }

  topicSelect(topicId) {
    this.subjectList.topics.forEach(topic => {
      if (topicId == topic.id) {
        this.topicId = topic.id;
        this.topicTitle = topic.title;
        this.topicPreview = topic.preview;
        this.topicAmount = topic.amount;
        this.topicGateWayId = topic.paymentgateway_id;
        this.paymentGateWayName = topic.payment_type ? topic.payment_type.title : '';
        this.topicKey = topic.payment_type ? topic.payment_type.key : '';
        this.topicCurrency = topic.currency;
      }
    });
  }

  subscribePay(){
    this.payPalPay = false;
  }

  payementDetails(type :string, subjectDetails : any){
    
    let details : any = {
      'type' : type,
      'id' : subjectDetails.id,
      'amount' : subjectDetails.amount,
      'currency' : subjectDetails.currency,
      'title' :  subjectDetails.title,
      'paymentGateWayid' : subjectDetails.paymentgateway_id,
      'payementGateWayname' : subjectDetails.payment_type ? subjectDetails.payment_type.title : '',
      'key' : subjectDetails.payment_type ? subjectDetails.payment_type.key : ''
    }

    if(this.offer){
      details.offer = this.offer;
      details.afterDiscount = subjectDetails.amount - this.offer.discountAmount;
      details.beforeDiscount = subjectDetails.amount;
    }
    
    if((subjectDetails.payment_type.title == "PayPal") || (subjectDetails.payment_type.title == "Stripe")){
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  topicPayementDetails(type :string, id:number, amount:number, currency:string, title:string, paymentId, paymentName, key){
    let details = {
      'type' : type,
      'id' : id,
      'amount' : amount,
      'currency' : currency,
      'title' :  title,
      'paymentGateWayid' : paymentId,
      'payementGateWayname' : paymentName,
      'key' : key
    }
    if((paymentName == "PayPal") || (paymentName == "Stripe")){
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose(){
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  navigateUrl(topic : any){
    if(!topic.isPaid){
      this.router.navigate(['./student/content/']).then(()=>{
        this.storage.set('contentId',topic.id);
        this.redirectionService.sendContentUrl({'id' : topic.id, 'type':'subject'});
      });
      // this.router.navigate(['./student/content/', topic.id]);
    } else if(this.subjectList.purchase || topic.purchase){
      this.router.navigate(['./student/content/']).then(()=>{
        this.storage.set('contentId',topic.id);
        this.redirectionService.sendContentUrl({'id' : topic.id, 'type':'subject'});
      });
      // this.router.navigate(['./student/content/', topic.id]);
    } else {
      this.topicSelect(topic.id);
      this.subscribePay();
      let paymentModel: HTMLElement = document.getElementById('paymentButton') as HTMLElement;
      paymentModel.click();
    }
  }

  afterPayment(paymentDetails){
      
    this.payPalPay = false;
    this.coupon = undefined;
    this.offer = undefined;
    this.discountAmount = undefined;
    this.discountMessage = '';
    let paymentTopicModel: HTMLElement = document.getElementById('closeTopicPayment') as HTMLElement;
    if(paymentTopicModel){
      paymentTopicModel.click();
    }
    let paymentSubModel: HTMLElement = document.getElementById('closeSubPayment') as HTMLElement;
    if(paymentSubModel){
      paymentSubModel.click();
    }
    this.ngOnInit();
  }

  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
  }

  checkCoupon(){
    this.discountMessage = '';
    this.discountAmount = 0;
    this.offer = undefined;
    this.discountSuccess = false;
    
    const data = {
      "accountId" : this.institute.account.id,
      "subjectId" : this.subjectList.id,
      "couponCode" : this.coupon
    }
    
    this.subscriptions.push(this.paymentGateWayService.checkCoupon(data).subscribe((res: ServerResponse) => {
      
      if (res && res.success) {
        if(res.data.currency.code == this.subjectList.currency.code){
          let couponData = res.data;
          if(this.subjectList.amount >= couponData.minBuyAmount){
            this.discountAmount = Math.round((this.subjectList.amount * (couponData.discount/100))*100)/100;
            
            if(this.discountAmount > couponData.maxAmount){
              this.toastr.success('Maximum discount amount '+ couponData.maxAmount + ' applied');
              this.discountMessage = 'Maximum discount amount '+ couponData.maxAmount + ' applied';
              this.discountAmount = couponData.maxAmount;
              this.discountSuccess = true;
            } else {
              this.discountMessage = 'Discount amount '+ this.discountAmount + ' applied';
              this.discountSuccess = true;
              this.toastr.success('Discount amount '+ this.discountAmount + ' applied');
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
        } else {
          this.discountMessage = "Invalid coupon code";
          this.toastr.error("Invalid coupon code");
        }
      }
    },
      (err) => {
        this.discountMessage = err.error;
        this.toastr.error(err.error);
      }));
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => {
        if(subscription){
          subscription.unsubscribe();
        }
      });
    }
  }

  defaultImageSet(event: any){
    event.target.src = this.defaultImage;

  }

}
