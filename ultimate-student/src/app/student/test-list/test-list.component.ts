import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TestDetailsService } from './../../RestApiCall/ApiHelper/test-details.service';
declare var $ :any;
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit, OnDestroy {

  payPalPay: boolean = false;
  testInfo : any = {};
  tests : any;
  redirectId: any;
  instituteLogo : any;
  results: any;
  result : boolean = false;
  private subscriptions: Subscription[] = [];
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private toastr: ToastrService, public testDetailsService: TestDetailsService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.testList();
    this.resultList();
  }

  goBack(){
    this.location.back();
  }

  testList(){
    this.subscriptions.push(this.testDetailsService.getTestList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        let i = 0;
        while (i < res.data.length) {
          if (res.data[i].testResult) {
            res.data.splice(i, 1);
          } else {
            ++i;
          }
        }
        this.tests = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(testDetails : any){
    this.storage.set('testData',testDetails);
    if(testDetails.testResult != null){
      
      this.router.navigate(['./student/result']).then(()=>{
        this.storage.set('resultId',testDetails.id);
        this.redirectionService.sendTestResultUrl(testDetails.id);
      });
    } else if(!testDetails.isPaid || testDetails.purchase!=null){

      this.router.navigate(['./student/taketest']).then(()=>{
        this.storage.set('testId',testDetails.id);
        this.redirectionService.sendTestUrl(testDetails.id);
      });
    } else {
      this.testInfo.id = testDetails.id;
      this.testInfo.amount = testDetails.amount;
      this.testInfo.preview = testDetails.preview;
      this.testInfo.title = testDetails.title;
      this.testInfo.paymentgateway_id = testDetails.paymentgateway_id;
      this.testInfo.paymentGateWayName = testDetails.payment_type ? testDetails.payment_type.title : '';
      this.testInfo.Key = testDetails.payment_type ? testDetails.payment_type.key : '';
      this.testInfo.currency = testDetails.currency;
      let openSubscribe: HTMLElement = document.getElementById('testModalBtn') as HTMLElement;
      openSubscribe.click();
    }
  }

  subscribePay(){
    this.payPalPay = false;
  }

  payementDetails(type :string, testDetails : any){
    
    let details = {
      'type' : type,
      'id' : testDetails.id,
      'amount' : testDetails.amount,
      'currency' : testDetails.currency,
      'title' :  testDetails.title,
      'paymentGateWayid' : testDetails.paymentgateway_id,
      'payementGateWayname' : testDetails.paymentGateWayName,
      'key' : testDetails.Key
    }
    
    if((testDetails.paymentGateWayName == "PayPal") || (testDetails.paymentGateWayName == "Stripe")){
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose(){
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  afterPayment(paymentDetails){
    this.payPalPay = false;
    // $('.modal').modal('hide');
    let paymentTestModel: HTMLElement = document.getElementById('closeTestpay') as HTMLElement;
    if(paymentTestModel){
      paymentTestModel.click();
    }
    this.ngOnInit();
  }

  allTestlist(){
    this.router.navigate(['./student/alltest']);
  }

  resultList(){
    this.subscriptions.push(this.testDetailsService.getResultList().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        if(res.data.length > 1){
          this.results = res.data.reverse();
        } else
        this.results = res.data;
        if(res.data.length >= 1){
          this.result = true;
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigateResult(id : number){
    this.router.navigate(['./student/result']).then(()=>{
      this.storage.set('resultId',id);
      this.redirectionService.sendTestResultUrl(id);
    });
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
