import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { HelperService } from './../RestApiCall/NetworkLayer/helper.service';
import { PaymentGateWayService } from './../RestApiCall/ApiHelper/payment-gate-way.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {

  courseLists : any;
  account : any;
  payPalPay: boolean = false;
  courseSelectedDetails: any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument, @Inject(SESSION_STORAGE) private storage: WebStorageService, public homePageCall:HomepageHelper, public helperService: HelperService, public paymentGateWayService: PaymentGateWayService, public router: Router, private titleService: Title,private toastr: ToastrService) { 
    this.subscriptions.push(this.helperService.listenLogout().subscribe(value => {
      this.ngOnInit();
    }));
  }

  ngOnInit() {
    
    this.subscriptions.push(this.homePageCall.getDashboardData().subscribe((res: any) => {
      if(res.success && res.data){
        if(res.data.account){
          if(res.data.account.title){
            this.titleService.setTitle(res.data.account.title);
          }
          if(res.data.account.image){
            
            if(window.location.hostname == "online.example.com"){
              this._document.getElementById('appFavicon').setAttribute('href', "https://online.example.com/assets/images/icon.png");
            } else {
              this._document.getElementById('appFavicon').setAttribute('href', res.data.account.image);
            }
          }
          this.storage.set('account', res.data.account);
          if(!this.storage.get('isLogedIn')){
            this.storage.set('bearer_token',res.data.account.bearer_token);
          }
          this.helperService.account();
        }
        this.courseLists = res.data.course;
        this.account = res.account;
      }
    },
      (err) => {

      }));
  }

  checkLogin(){
    
    if(this.storage.get('isLogedIn')){
      let paymentSubjectModel: HTMLElement = document.getElementById('subCourse') as HTMLElement;
      if (paymentSubjectModel) {
        paymentSubjectModel.click();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateUrl(course){
    this.storage.set('subjectDetails',course);
    if(!course.isPaid || course.purchase !=null){
      window.open(environment.redirectUrl);
      // window.open(environment.redirectUrl+'student/dashboard?token='+this.storage.get('student_token')+'&id='+course.id);
    } else {
      this.router.navigate(['/subject']);
    }
  }

  courseSelected(course){
    this.courseSelectedDetails = course;
  }

  payementDetails(type: string, courseDetails: any) {
    
    let details = {
      'type': type,
      'id': courseDetails.id,
      'amount': courseDetails.amount,
      'currency': courseDetails.currency,
      'title': courseDetails.title,
      'paymentGateWayid': courseDetails.paymentgateway_id,
      'payementGateWayname': courseDetails.payment_type.title,
      'key': courseDetails.payment_type.key
    }
    if (courseDetails.paymentGateWayName == "PayPal") {
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose() {
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  afterPayment(paymentDetails) {
    this.payPalPay = false;
    let paymentSubjectModel: HTMLElement = document.getElementById('subjectClose') as HTMLElement;
    if (paymentSubjectModel) {
      paymentSubjectModel.click();
    }
    
    this.ngOnInit();
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
