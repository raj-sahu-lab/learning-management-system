import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { ContentApiHelper } from './../../RestApiCall/ApiHelper/content.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
declare var $ :any;
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {

  contentTitle = '';
  contentPreview = '';
  contentAmount = '';
  contentId = '';
  contentCurrency : any;
  contentList :any;

  topicId = '';
  payPalPay: boolean = false;
  contentGateWayId: any;
  contentPaymentGateWayName: any;
  contentKey: any;
  redirectId: any;
  fromType: any;
  private subscriptions: Subscription[] = [];

  constructor(public helperService : HelperService, public redirectionService: RedirectionService, public router: Router, private route: ActivatedRoute, protected serviceContent: ContentApiHelper, private toastr: ToastrService , public paymentGateWayService : PaymentGateWayService, private location: Location) {
    // this.topicId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getContentUrl().subscribe(data =>{
      this.topicId = data.id;
      this.fromType = data.type;
    }));
    if(!this.topicId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.contentId){
      this.topicId = ids.contentId;
      }
    }
  }   

  ngOnInit() {
    this.contentDetails();
  }

  goBack(){
    this.location.back();
  }

  contentDetails()
  {
    let topicData: { [k: string]: any } = {

      topicId: this.topicId,
    };

    this.subscriptions.push(this.serviceContent.getContentDetails(topicData).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.contentList = res.data;
        if(this.contentList.purchase){
          if(this.contentList.purchase.remainHours){
            this.contentList.purchase.remainTime = this.hoursminute(this.contentList.purchase.remainHours);
          }
        }
        if(this.contentList.subject){
          if(this.contentList.subject.purchase){
            if(this.contentList.subject.purchase.remainHours){
              this.contentList.subject.purchase.remainTime = this.hoursminute(this.contentList.subject.purchase.remainHours);
            }
          }
        }
        
        this.contentList.contents.forEach(sub => {
          if(sub.purchase){
            if(sub.purchase.remainHours){
              sub.purchase.remainTime = this.hoursminute(sub.purchase.remainHours);
            }
          }
        });   
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  contentSelect(contentId) {
    this.contentList.contents.forEach(content => {

      if (contentId == content.id) {
        this.contentId = content.id;
        this.contentTitle = content.title;
        this.contentPreview = content.preview;
        this.contentAmount = content.amount;
        this.contentGateWayId = content.paymentgateway_id;
        this.contentPaymentGateWayName = content.payment_type ? content.payment_type.title : ''
        this.contentKey = content.payment_type ? content.payment_type.key : '';
        this.contentCurrency = content.currency;
      }
    });
  }

  subscribePay(){
    this.payPalPay = false;
  }

  payementDetails(type :string, id:number, amount:number, currency:string, title:string, gateWayId, gateWayName, key){
    let details = {
      'type' : type,
      'id' : id,
      'amount' : amount,
      'currency' : currency,
      'title' :  title,
      'paymentGateWayid' : gateWayId,
      'payementGateWayname' : gateWayName,
      'key' : key
    }
    if((gateWayName == "PayPal") || (gateWayName == "Stripe")){
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose(){
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  navigateUrl(content : any){
    
    if(!content.isPaid){
      this.router.navigate(['./student/content-details/']).then(()=>{
        this.redirectId = JSON.parse(localStorage.getItem('id'));
        this.redirectId.contentDetailsId = content.id;
      
        localStorage.setItem('id', JSON.stringify(this.redirectId));
        this.redirectionService.sendContentDetailsUrl({'id':content.id, 'type': this.fromType});
      });
      // this.router.navigate(['./student/content-details/', content.id]);
    } else if(this.contentList.purchase || content.purchase || this.contentList.subject.purchase){
      this.router.navigate(['./student/content-details/']).then(()=>{
        this.redirectId = JSON.parse(localStorage.getItem('id'));
        this.redirectId.contentDetailsId = content.id;
      
        localStorage.setItem('id', JSON.stringify(this.redirectId));
        this.redirectionService.sendContentDetailsUrl({'id':content.id, 'type': this.fromType});
      });
      // this.router.navigate(['./student/content-details/', content.id]);
    } else {
      this.contentSelect(content.id);
      this.subscribePay();
      let paymentModel: HTMLElement = document.getElementById('paymentButton') as HTMLElement;
      paymentModel.click();
    }
  }

  afterPayment(paymentDetails){
      this.payPalPay = false;
      let paymentModel: HTMLElement = document.getElementById('closePayModel') as HTMLElement;
      paymentModel.click();
      this.ngOnInit();
  }

  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
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

}
