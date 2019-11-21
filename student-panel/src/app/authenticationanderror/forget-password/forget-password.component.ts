import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';

import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { forgetPasswordApiHelper } from '../../RestApiCall/ApiHelper/forgetPassword.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  providers: [forgetPasswordApiHelper],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  animations: [routerTransition()]
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  LoginMessage ='';

  registerMobile = true;
  registerOTP = false;
  registerPassword = false;

  mobile = '';
  otp = '';
  otpSend = null;

  password = '';
  cpassword = '';

  isReadonly = true;

  intervalId = 0;
  countDownMessage = null;
  seconds = null;
  private subscriptions: Subscription[] = [];

  constructor(public router: Router,protected serviceForgetPassword: forgetPasswordApiHelper, private toastr: ToastrService) { }

  ngOnInit() {
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
        // this.countDownMessage = this.seconds + " Seconds";
      }
      else {
        this.stopCountDown();        
        this.countDownMessage = 0;
      }
    }, 1000);
  }
  
  sendOTP() {
    
    if (this.mobile == '') {

      this.LoginMessage='Enter your mobile number.';

    } else if (this.mobile.toString().length < 5 || this.mobile.toString().length > 10) {
      
      this.LoginMessage = 'Please enter valid number.';

    } else {

      this.LoginMessage = '';

      let phoneData:{[k: string]: any} = {
        phone: this.mobile,
      };
 
      this.subscriptions.push(this.serviceForgetPassword.sendOTP(phoneData).subscribe((res: ServerResponse) => {
        
        if (res.success && res.data != null) {
         
            this.otpSend = res.data.otp;
            
            this.registerMobile = false;
            this.registerOTP = true;
            this.registerPassword = false;
            this.startCountDown();
        }

      },
      (err) => {
        this.toastr.error(err.error);
        this.LoginMessage=err.error
      }));

    }
  }  

  verifyOTP()
  {
    if (this.mobile == '') {

      this.LoginMessage='Enter Mobile';

    } else if (this.otp == '') {

      this.LoginMessage='Enter OTP';

    } else if (this.otp != this.otpSend) {

      this.LoginMessage='Enter valid OTP';

    } else {

      this.LoginMessage='';

      this.registerMobile = false;
      this.registerOTP = false;
      this.registerPassword = true;      

    }
  }

  submitButtonClick()
  {
    if (this.password == '') {

      this.LoginMessage='Enter new password';

    } else if (this.cpassword == '') {

      this.LoginMessage='Enter confirm password';

    } else if (this.password != this.cpassword ) {

      this.LoginMessage='Confirm password is not match';

    } else {     

      this.LoginMessage='';

      let passwordData:{[k: string]: any} = {

        phone: this.mobile,
        password: this.password,

      };

      this.subscriptions.push(this.serviceForgetPassword.changePassword(passwordData).subscribe((res: ServerResponse) => {
        
        if (res.success) {
          this.router.navigate(['']); 
          this.LoginMessage=res.message;
        }
      },
      (err) => {
        this.toastr.error(err.error);
        console.log(err);
      }));

    }
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
