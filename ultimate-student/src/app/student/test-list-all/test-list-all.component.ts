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
  selector: 'app-test-list-all',
  templateUrl: './test-list-all.component.html',
  styleUrls: ['./test-list-all.component.css']
})
export class TestListAllComponent implements OnInit, OnDestroy {

  payPalPay: boolean = false;
  testInfo : any = {};
  tests : any;
  redirectId: any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private toastr: ToastrService, public testDetailsService: TestDetailsService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.testList()
  }

  goBack(){
    this.location.back();
  }

  testList(){
    this.subscriptions.push(this.testDetailsService.getTestList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.tests = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(testDetails : any){
    this.storage.set('testData', testDetails);
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
