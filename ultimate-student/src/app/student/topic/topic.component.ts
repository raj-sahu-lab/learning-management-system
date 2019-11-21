import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { SubjectApiHelper } from './../../RestApiCall/ApiHelper/subject.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
declare var $: any;
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit, OnDestroy {

  subjectList: any;
  topicTitle = '';
  topicPreview = '';
  topicAmount = null;
  topicCurrency : any;

  subjectId = '';
  topicId: any;
  payPalPay: boolean = false;
  topicGateWayId: any;
  paymentGateWayName: any;
  topicKey: any;
  redirectId: any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public router: Router, private route: ActivatedRoute, protected serviceSubject: SubjectApiHelper, private toastr: ToastrService, public paymentGateWayService : PaymentGateWayService, private location: Location) {
    // this.subjectId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getDashBoardToTopic().subscribe(id =>{
      this.subjectId = id;
    }));
    if(!this.subjectId){
      if(this.storage.get('topicId')){
        this.subjectId = this.storage.get('topicId');
      }
    }
  }

  ngOnInit() {
    this.subjectDetails();
  }

  goBack(){
    this.location.back();
  }

  subjectDetails() {
    let subjectData: { [k: string]: any } = {

      subjectId: this.subjectId,
    };

    this.subscriptions.push(this.serviceSubject.getSubjectDetails(subjectData).subscribe((res: ServerResponse) => {

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
        this.topicCurrency = topic.currency;
        this.topicGateWayId = topic.paymentgateway_id;
        this.paymentGateWayName = topic.payment_type ? topic.payment_type.title : '';
        this.topicKey = topic.payment_type ? topic.payment_type.key : '';
      }
    });
  }

  subscribePay(){
    this.payPalPay = false;
  }

  payementDetails(type :string, id:number, amount:number, currency:string, title:string, paymentId, paymentName, key){
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
        this.redirectionService.sendContentUrl({'id' : topic.id, 'type':'topic'});
      });
      // this.router.navigate(['./student/content/', topic.id]);
    } else if(this.subjectList.purchase || topic.purchase){
      this.router.navigate(['./student/content/']).then(()=>{
        this.storage.set('contentId',topic.id);
        this.redirectionService.sendContentUrl({'id' : topic.id, 'type':'topic'});
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
    // $('.modal').modal('hide');
    let paymentTopicModel: HTMLElement = document.getElementById('closeTopicPay') as HTMLElement;
    if(paymentTopicModel){
      paymentTopicModel.click();
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
