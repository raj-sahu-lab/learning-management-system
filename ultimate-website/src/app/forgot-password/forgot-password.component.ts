import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  registerMobile : any = true;
  registerOTP : any = false;
  constructor() { }

  ngOnInit() {
  }

  sendOtp(){
    this.registerMobile = false;
    this.registerOTP = true;
  }

  verifyOtp(){
    
  }

}
