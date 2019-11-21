import { Component, OnInit, Inject ,ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterService } from '../RestApiCall/ApiHelper/register.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { environment } from '../../environments/environment';
import CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {


  @ViewChild('recaptchaRe', { static: true }) recaptchaElement: ElementRef;

  registerMobile = true;
  registerOTP = false;
  registerDetails = false;
  registerPassword = false;
  setBranch = false;
  countryList: any;
  educationList: any;
  selectedCountry: any = {};
  terms : any;
  LoginMessage: any ='';

  countryCode = undefined;
  mobile = '';
  otp = '';
  fname = '';
  lname = '';
  education = undefined;
  email = '';
  password = '';
  cpassword = '';
  branchCode :  any;

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
  hidesubmit: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public httpURL: HttpClient, public registerService :RegisterService, private toastr: ToastrService, public router: Router) { 
    this.selectedCountry.title = "india";
    this.selectedCountry.code = "91";
  }

  ngOnInit() {

    const tim = localStorage.getItem('rtime');
    if(tim){
        var bytes  = CryptoJS.AES.decrypt(tim, environment.en_key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var resJson = JSON.parse(originalText);
    } else var resJson = null;

    this.lastRegister = new Date(resJson);
    this.timeNow = new Date();
    if(this.lastRegister){
        if((this.timeNow-this.lastRegister) < (60000*90)){
            this.time = Math.floor(90-((this.timeNow-this.lastRegister))/60000);
        }
    }

    this.getCountryList();
    this.getEducation();
  }

  getCountryList(){
    const allCountry = environment.apiUrl+'countryCityList';

    this.subscriptions.push(this.httpURL.get(allCountry).subscribe((res: any) => {
      this.countryList = res.data;
    }));
  }

  getEducation(){
    const allEducation = environment.apiUrl+'education';

    this.subscriptions.push(this.httpURL.get(allEducation).subscribe((res: any) => {
      this.educationList = res.data;
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

  sendOtp(){
    

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

      this.subscriptions.push(this.registerService.sendOTP(phoneData).subscribe((res: ServerResponse) => {
        // console.log(res);
        
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
          if(err){
            this.toastr.error(err.error);
          }
          this.LoginMessage = err.error;

        }));

    }
  }

  changeNumber() {
    this.isReadonly = !this.isReadonly;
    this.stopCountDown();
    this.countDownMessage = 0;
    this.registerOTP = false;
    this.registerMobile = true;
  }

  verifyOtp(){

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


          this.subscriptions.push(this.registerService.verifyOTP(otpData).subscribe((res: any) => {

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
              this.toastr.error(err.error);
              this.LoginMessage = err.error;
              //console.log(err);
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


          this.subscriptions.push(this.registerService.verifyOTP(otpData).subscribe((res: any) => {

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
              this.toastr.error(err.error);
              this.LoginMessage = err.error;
              //console.log(err);
            }));

        }
      } else {
        this.LoginMessage = 'Please check i am not robot check box';
      }
    } else{
      this.hidesubmit = true;
      this.register = new Date();
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.register), environment.en_key).toString();
      localStorage.setItem('rtime', ciphertext);
      this.time = 90;
      const tim = localStorage.getItem('rtime');
      if(tim){
          var bytes  = CryptoJS.AES.decrypt(tim, environment.en_key);
          var originalText = bytes.toString(CryptoJS.enc.Utf8);
          var resJson = JSON.parse(originalText);
      } else var resJson = null;

      this.lastRegister = new Date(resJson);
      this.timeNow = new Date();
      if(this.lastRegister){
          if((this.timeNow-this.lastRegister) < (60000*90)){
              this.time = Math.floor(90-((this.timeNow-this.lastRegister))/60000);
          }
      }
      this.LoginMessage = 'You have reached maximum attempt, please try after some time';
    }
  }

  setPassword(){
    // this.registerDetails = false;
    // this.registerPassword = true;

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

  registers(){
    // this.registerPassword = false;
    // this.registerMobile = true;

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

      this.LoginMessage = 'Confirm password is not metch';

    } else if (!this.validateEmail(this.email) && this.email != '') {

      // else if (this.email == '') {

      //   this.LoginMessage='Enter email address';

      // } 

      this.LoginMessage = 'Please enter valid email.';

    } else if (this.terms == null) {

      this.LoginMessage = 'Select Terms & Condition';

    } else {

      this.LoginMessage = '';

      let registerData: { [k: string]: any } = {

        countryCode: this.selectedCountry.code,
        phone: this.mobile,
        firstName: this.fname,
        lastName: this.lname,
        educationType: this.education,
        password: this.password,
        email: this.email,
        notificationToken : '',
        deviceType: 3
      };
      
      this.subscriptions.push(this.registerService.signUP(registerData).subscribe((res) => {
        // console.log(res);
        
        if (res.success && res.data != null) {

          // this.storage.set('isLogedIn', 1);
          // this.storage.set('studentData', res.data);
          this.storage.set('bearer_token', res.data.bearer_token);
          // this.storage.set('student_token', res.data.student_token);
          this.registerMobile = false;
          this.registerOTP = false;
          this.registerDetails = false;
          this.registerPassword = false;
          this.setBranch = true;

        }
      },
        (err) => {

          this.LoginMessage = err.error;

        }));

    }
  }

  countrySelected(country){
    this.selectedCountry = country;
    let dropdown: HTMLElement = document.getElementById('dropdown') as HTMLElement;
    dropdown.click();
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
        a[i].style.display = "block";
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
      this.subscriptions.push(this.registerService.setBranch(instituteData).subscribe((res: any) => {
        // console.log(res);
        
        if(res.success){
          this.storage.set('isLogedIn', 1);
          this.storage.set('bearer_token', res.data.bearer_token);
          this.storage.set('student_token', res.data.student_token);
          this.router.navigate(['/']);
        }
      },
          (err) => {
  
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
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
