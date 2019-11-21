import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentGateWayService } from './../../../RestApiCall/ApiHelper/payment-gate-way.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TestBundleService } from './../../../RestApiCall/ApiHelper/test-bundle.service';
declare var $ :any;
import { RedirectionService } from './../../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bundle-list',
  templateUrl: './bundle-list.component.html',
  styleUrls: ['./bundle-list.component.css']
})
export class BundleListComponent implements OnInit, OnDestroy {

  instituteLogo: any;
  page = 1;
  limit = 5;
  bundleList: any = [];
  bundleInfo : any= {};
  payPalPay: boolean = false;
  results: any;
  result : boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private toastr: ToastrService, public testBundleService: TestBundleService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.testBundle(this.page, this.limit);
    this.resultList();
  }

  goBack(){
    this.location.back();
  }

  testBundle(page, limit){
    this.page = page;
    this.subscriptions.push(this.testBundleService.getBundleList(page, limit).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        if(this.bundleList.length == 0){
          this.bundleList = res.data;
          // this.corousel();
        } else {
          res.data.forEach(bundle => {
            this.bundleList.push(bundle);
          });
        }
        this.bundleList.forEach(bundle => {
          if(bundle.purchase){
            if(bundle.purchase.remainHours){
              bundle.purchase.remainTime = this.hoursminute(bundle.purchase.remainHours);
            }
          }
        });
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  corousel(){
    $(document).ready(function () {
      
      $('#carousel-example').on('slide.bs.carousel', function (e) {
        
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 4;
        var totalItems = $('.carousel-item').length;
        
        if (idx >= totalItems-(itemsPerSlide-1)) {
            var it = itemsPerSlide - (totalItems - idx);
            
            for (var i=0; i<it; i++) {
                // append slides to end
                if (e.direction=="left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                }
                else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
      });
    });
  }

  requestNavigate(bundleDetails : any){

    this.storage.set('testBundle',bundleDetails);
    if(!bundleDetails.isPaid || bundleDetails.purchase!=null){
      this.router.navigate(['./student/bundleSet']);
    }else {
      this.bundleInfo.id = bundleDetails.id;
      this.bundleInfo.amount = bundleDetails.amount;
      this.bundleInfo.preview = bundleDetails.preview;
      this.bundleInfo.title = bundleDetails.title;
      this.bundleInfo.paymentgateway_id = bundleDetails.paymentGateWayId;
      this.bundleInfo.paymentGateWayName = bundleDetails.payment_type ? bundleDetails.payment_type.title : '';
      this.bundleInfo.Key = bundleDetails.payment_type ? bundleDetails.payment_type.key : '';
      this.bundleInfo.currency = bundleDetails.currency;

      let openSubscribe: HTMLElement = document.getElementById('testBundleModalBtn') as HTMLElement;
      openSubscribe.click();
    }
  }

  subscribePay(){
    this.payPalPay = false;
  }

  payementDetails(type :string, bundleDetails : any){
    
    let details = {
      'type' : type,
      'id' : bundleDetails.id,
      'amount' : bundleDetails.amount,
      'currency' : bundleDetails.currency,
      'title' :  bundleDetails.title,
      'paymentGateWayid' : bundleDetails.paymentgateway_id,
      'payementGateWayname' : bundleDetails.paymentGateWayName,
      'key' : bundleDetails.Key
    }
    
    if((bundleDetails.paymentGateWayName == "PayPal") || (bundleDetails.paymentGateWayName == "Stripe")){
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
    let paymentTestModel: HTMLElement = document.getElementById('closeTestpay') as HTMLElement;
    if(paymentTestModel){
      paymentTestModel.click();
    }
    this.bundleList = [];
    this.ngOnInit();
  }

  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
  }

  testBundleList(){
    this.router.navigate(['./student/testBundleList']);
  }

  resultList(){
    this.subscriptions.push(this.testBundleService.getBundleResultList().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        if(res.data.length >= 1){
          this.result = true;
          this.results = res.data.reverse();
          this.results.forEach(result => {
            if(result.series.marked && !result.series.markEqual){
              result.series.questionList.forEach(question => {
                result.series.totalMarks += question.question.mark;
              });
            }
            if(result.series.timed && !result.series.timeEqual){
              result.series.questionList.forEach(question => {
                result.series.duration += question.question.duration;
              });
            }
          });
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigateResult(resultData){
    this.storage.set('testBundleResult', resultData);

    this.router.navigate(['./student/bundleResult']).then(()=>{
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
