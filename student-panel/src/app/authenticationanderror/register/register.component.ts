import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { HttpClient } from '@angular/common/http';

import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { RegisterApiHelper } from '../../RestApiCall/ApiHelper/register.service';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { ProfileService } from './../../RestApiCall/ApiHelper/profile.service';
import { PushNotificationService } from './../../RestApiCall/ApiHelper/push-notification.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  providers: [RegisterApiHelper],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [routerTransition()]
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('recaptchaRe', { static: true }) recaptchaElement: ElementRef;

  countryList = [];
  educationList = [];
  LoginMessage = '';

  registerMobile = true;
  registerOTP = false;
  registerDetails = false;
  registerPassword = false;
  registerInstitute = false;
  setBranch = false;

  instituteIds = [];
  instituteList = [];
  countryCode = undefined;
  mobile = '';
  otp = '';
  fname = '';
  lname = '';
  education = undefined;
  email = '';
  terms = null;
  password = '';
  cpassword = '';
  institute = '';

  failedCount: number = 0;
  showCaptch: boolean = false;
  captureVerified: boolean = false;
  key = environment.googleCpatchKey;
  lastRegister : any;
  timeNow : any;
  time:any;
  register :any;

  isReadonly = true;

  intervalId = 0;
  countDownMessage = null;
  seconds = null;
  defaultInstituteSelected: any;
  defaultInstitute : boolean = false;
  instituteListSelected : any;
  selectedCountry: any = {};
  pushToken: any = '';
  branchCode :  any;
  notificationMessage = true;
  private subscriptions: Subscription[] = [];

  constructor(protected serviceDashboard: DashboardApiHelper, public httpURL: HttpClient, public router: Router, protected serviceRegister: RegisterApiHelper, public profileService : ProfileService, public pushNotificationService : PushNotificationService, private toastr: ToastrService) {
    this.selectedCountry.title = "india";
    this.selectedCountry.code = "91";
    this.subscriptions.push(this.pushNotificationService.getToken().subscribe(token => {
      this.notificationMessage = false;
      this.pushToken = token;
    }));
   }

  ngOnInit() {
    this.lastRegister = new Date(localStorage.getItem('rtime'));
    this.timeNow = new Date();
    if(this.lastRegister){
        if((this.timeNow-this.lastRegister) < (60000*90)){
            this.time = Math.floor(90-((this.timeNow-this.lastRegister))/60000);
        }
    }

    this.countryCity();
    this.getEducationList();
    this.pushNotificationService.requestPermission();
  }
  countryCity() {

    this.subscriptions.push(this.profileService.getCounteryCity().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.countryList = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  getEducationList(){
    
    this.subscriptions.push(this.profileService.getEduaction().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.educationList = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  startCountDown() {
    this.isReadonly = true;
    this.seconds = 120;
    this.countDown();
  }

  stopCountDown() {
    clearInterval(this.intervalId);
  }

  countDown() {
    this.intervalId = window.setInterval(() => {
      if (this.seconds != 0) {
        this.seconds -= 1;
        let min = Math.floor(this.seconds / 60);
        let sec = Math.floor(this.seconds % 60);
        this.countDownMessage = min + ' Minutes ' + sec + " Seconds";
      }
      else {
        this.stopCountDown();
        this.countDownMessage = 0;
      }
    }, 1000);
  }

  sendOTP() {

    if (!this.selectedCountry.code) {

      this.LoginMessage = 'Select country code.';

    } else if (this.mobile == '') {

      this.LoginMessage = 'Enter your mobile number.';

    } else if (this.mobile.toString().length < 5 || this.mobile.toString().length > 16) {

      this.LoginMessage = 'Please enter valid number.';

    } else {

      this.LoginMessage = '';

      let phoneData: { [k: string]: any } = {
        countryCode: this.selectedCountry.code,
        phone: this.mobile
      };

      if(!this.lastRegister || ((this.timeNow-this.lastRegister) >=(60000*90))){
        this.subscriptions.push(this.serviceRegister.sendOTP(phoneData).subscribe((res: ServerResponse) => {
        
          if (res.success) {
  
            if (res.data) {
              if(res.data.status==200){
                this.registerMobile = false;
                this.registerOTP = false;
                this.registerDetails = true;
              }
            } else {
  
              this.registerMobile = false;
              this.registerOTP = true;
              this.startCountDown();
  
            }
  
          }
  
        },
          (err) => {
  
            this.LoginMessage = err.error;
            this.toastr.error(err.error);
          }));
      }
      

    }
  }

  changeNumber() {
    this.isReadonly = !this.isReadonly;
    this.stopCountDown();
    this.countDownMessage = 0;
    this.registerOTP = false;
    this.registerMobile = true;
  }

  verifyOTP() {
    if(this.failedCount < 6){
      if (this.failedCount < 3) {
        if (this.mobile == '') {

          this.LoginMessage = 'Enter Mobile';
    
        } else if (this.otp == '') {
    
          this.LoginMessage = 'Enter OTP';
    
        } else {
    
          this.LoginMessage = '';
    
          let otpData: { [k: string]: any } = {
            phone: this.selectedCountry.code + this.mobile,
            otp: this.otp,
          };
    
          this.subscriptions.push(this.serviceRegister.verifyOTP(otpData).subscribe((res: ServerResponse) => {
    
            if (res.success) {
    
              this.registerMobile = false;
              this.registerOTP = false;
              this.registerDetails = true;
    
            }
          },
            (err) => {
              this.failedCount++;
              if (this.failedCount >= 3) {
                this.addRecaptchaScript();
                this.showCaptch = true;
              }
              this.LoginMessage = err.error;
              //console.log(err);
              this.toastr.error(err.error);
            }));
    
        }

      } else if (this.captureVerified){
        if (this.mobile == '') {

          this.LoginMessage = 'Enter Mobile';
    
        } else if (this.otp == '') {
    
          this.LoginMessage = 'Enter OTP';
    
        } else {
    
          this.LoginMessage = '';
    
          let otpData: { [k: string]: any } = {
            phone: this.selectedCountry.code + this.mobile,
            otp: this.otp,
          };
    
          this.subscriptions.push(this.serviceRegister.verifyOTP(otpData).subscribe((res: ServerResponse) => {
    
            if (res.success) {
    
              this.registerMobile = false;
              this.registerOTP = false;
              this.registerDetails = true;
    
            }
          },
            (err) => {
              this.failedCount++;
              if (this.failedCount >= 3) {
                this.addRecaptchaScript();
                this.showCaptch = true;
              }
              this.LoginMessage = err.error;
              //console.log(err);
              this.toastr.error(err.error);
            }));
    
        }

      } else this.LoginMessage = 'Please check i am not robot check box';

    } else{
      this.register = new Date();
      localStorage.setItem('rtime',this.register);
      this.time = 90;
      this.lastRegister = new Date(localStorage.getItem('rtime'));
      this.timeNow = new Date();
      if(this.lastRegister){
          if((this.timeNow-this.lastRegister) < (60000*90)){
              this.time = Math.floor(90-((this.timeNow-this.lastRegister))/60000);
          }
      }
      this.LoginMessage = 'You have reached maximum attempt, please try after some time';
    }
    
  }

  setPassword() {
    if (this.fname == '') {

      this.LoginMessage = 'Enter first name';

    } else if (this.education == undefined) {

      this.LoginMessage = 'Select education';

    } else {

      this.registerMobile = false;
      this.registerOTP = false;
      this.registerDetails = false;
      this.registerPassword = true;

      this.LoginMessage = '';
    }

  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  setInstitute() {
    if (this.password == '') {

      this.LoginMessage = 'Enter password';

    }else if(this.password.length < 6 || this.password.length > 16){
        this.LoginMessage = 'Passowrd must be minimum 6 characters and maximum 16 characters';
    } else if(this.password.search(/\d/) == -1){
        this.LoginMessage = 'Passowrd must contain number';
    } else if(this.password.search(/[a-zA-Z]/) == -1){
        this.LoginMessage = 'Passowrd must contain letter';
    } else if(this.password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1){
        this.LoginMessage = 'Passowrd must contain special character';
    } else if (this.cpassword == '') {

      this.LoginMessage = 'Enter confirm password';

    } else if (this.password != this.cpassword) {

      this.LoginMessage = 'Confirm password is not match';

    } else if (!this.validateEmail(this.email) && this.email != '') {

      // else if (this.email == '') {

      //   this.LoginMessage='Enter email address';

      // } 

      this.LoginMessage = 'Please enter valid email.';

    } else if (this.terms == null) {

      this.LoginMessage = 'Select Terms & Condition';

    } else {

      this.LoginMessage = '';

      let uuidRandom = uuid();
      if(uuidRandom){
          var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(uuidRandom), environment.en_key).toString();
          localStorage.setItem('uid', ciphertext);
      }

      let registerData: { [k: string]: any } = {

        countryCode: this.selectedCountry.code,
        phone: this.mobile,
        firstName: this.fname,
        lastName: this.lname,
        educationType: this.education,
        password: this.password,
        email: this.email,
        notificationToken : this.pushToken,
        deviceId : uuidRandom,
        deviceType: 3
      };
      
      this.subscriptions.push(this.serviceRegister.signUP(registerData).subscribe((res: ServerResponse) => {

        if (res.success && res.data != null) {

          this.registerMobile = false;
          this.registerOTP = false;
          this.registerDetails = false;
          this.registerPassword = false;
          // this.registerInstitute = true;
          this.setBranch = true;
          // localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('logintoken', res.data.bearer_token);
          localStorage.setItem('User', JSON.stringify(res.data));

          // this.getInstitute();

        }
      },
        (err) => {

          this.LoginMessage = err.error;
          this.toastr.error(err.error);
        }));

    }
  }

  getInstitute() {
    this.subscriptions.push(this.serviceRegister.getInstituteList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.instituteList = res.data;
        this.instituteList.forEach(institute => {
          if(institute.title=='Company'){
            setTimeout(()=>{
              let openSubscribe: HTMLElement = document.getElementById(institute.id) as HTMLElement;
              openSubscribe.click();
            },1000);
          }
          
        });
      }
    },
      (err) => {
        this.toastr.error(err.error);
        console.log(err);
      }));
  }

  instituteChecked(id, event) {

    if (event.target.checked) {

      this.instituteIds.push(id);
      
    }

    if (!event.target.checked) {

      let index = this.instituteIds.indexOf(id);

      if (index > -1) {

        this.instituteIds.splice(index, 1);
      }
    }

  }

  submitButtonClick() {
    let instituteData: { [k: string]: any } = {

      instituteIdList: this.instituteIds
    };

    this.subscriptions.push(this.serviceRegister.addInstitutes(instituteData).subscribe((res: ServerResponse) => {
      this.subscriptions.push(this.serviceDashboard.getInstituteList().subscribe((res: ServerResponse) => {
        this.instituteListSelected = res.data;
        this.instituteListSelected.forEach(element => {
          element.selected = false;
          if(element.title=='Company'){
            setTimeout(()=>{
              let openSubscribe: HTMLElement = document.getElementById(element.id) as HTMLElement;
              openSubscribe.click();
            },1000);
          }
        });
        this.defaultInstitute = true;
        this.registerInstitute = false;
      }));

    },
      (err) => {
        this.toastr.error(err.error);
        this.LoginMessage = err.error;
        //console.log(err);
      }));

  }

  defaultInstituteChecked(id, event) {

    if (event.target.checked) {
      this.defaultInstituteSelected = id;
    }

    this.instituteListSelected.forEach(institute => {
      if(institute.id == id){
        institute.selected = true;
      } else institute.selected = false;
    });

  }

  setDefaultInstitute() {

    if(this.defaultInstituteSelected){
      let instituteData: { [k: string]: any } = {
        instituteId: this.defaultInstituteSelected,
      };
  
      this.subscriptions.push(this.serviceDashboard.setInstitute(instituteData).subscribe((res: ServerResponse) => {
        if(res.success){
          localStorage.setItem('id', JSON.stringify({'subjectId' : '','topicId': '','contentId':'', 'contentDetailsId':'', 'testId':'', 'resultId':'', 'pollId': '', 'practiceTestId': '', 'forumCatId':'', 'forumSubId':'', 'forumArtId': '', 'forumTopId':'', 'supportId':'', 'liveClassId':''}));
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('User', JSON.stringify(res.data));
          this.router.navigate(['./student/dashboard']);
        }
      },
          (err) => {
            this.toastr.error(err.error);
          }));
    } else this.LoginMessage = "Select Default Institute";
    
  }

  countrySelected(country){
    this.selectedCountry = country;
  }

  filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("countrySelect");
    filter = input.value.toUpperCase();
    const div = document.getElementById("countrySearch");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      const txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  setBranchCode(){
    let instituteData: { [k: string]: any } = {

      code: this.branchCode
    };
    if(this.branchCode){
      this.subscriptions.push(this.serviceDashboard.setBranch(instituteData).subscribe((res: ServerResponse) => {
        
        if(res.success){
          localStorage.setItem('id', JSON.stringify({'subjectId' : '','topicId': '','contentId':'', 'contentDetailsId':'', 'testId':'', 'resultId':'', 'pollId': '', 'practiceTestId': '', 'forumCatId':'', 'forumSubId':'', 'forumArtId': '', 'forumTopId':'', 'supportId':'', 'liveClassId':''}));
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('User', JSON.stringify(res.data));
          this.router.navigate(['./student/dashboard']);
        }
      },
          (err) => {
            this.toastr.error(err.error);
          }));
    }
  }

  addRecaptchaScript() {
        
    window['grecaptchaCallback'] = () => {
        this.renderReCaptch();
    }

    (function (d, s, id, obj) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { obj.renderReCaptch(); return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
  }

  renderReCaptch() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
        'sitekey': environment.googleCpatchKey,
        'callback': (response) => {
            this.captureVerified = true;
        }
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
