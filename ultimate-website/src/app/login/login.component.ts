import { Component, OnInit, Inject, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import { ServerResponse } from './../RestApiCall/NetworkLayer/model.interface';
import { environment } from '../../environments/environment';
import CryptoJS from 'crypto-js';
import { RegisterService } from '../RestApiCall/ApiHelper/register.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

    user: any = {};
    LoginMessage: string = '';
    failedCount: number = 0;
    showCaptch: boolean;
    captureVerified: any;
    key = environment.googleCpatchKey;
    lastlogin: any;
    timeNow: any;
    time: any;
    setBranch : any= false;
    branchCode :  any;
    private subscriptions: Subscription[] = [];

    constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public homePageCall: HomepageHelper, public router: Router, public registerService :RegisterService) { }

    ngOnInit() {
        const tim = localStorage.getItem('time');
        if(tim){
            var bytes  = CryptoJS.AES.decrypt(tim, environment.en_key);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            var resJson = JSON.parse(originalText);
        } else var resJson = null;
        
        this.lastlogin = new Date(resJson);
        
        this.timeNow = new Date();
        if(this.lastlogin){
            if((this.timeNow-this.lastlogin) < (60000*90)){
                this.time = Math.floor(90-((this.timeNow-this.lastlogin))/60000);
            }
            
        }
    }

    onLoggedin() {

        if (this.user.phone === '') {

            this.LoginMessage = 'Please enter mobile number';

        } else if (this.user.password === '') {

            this.LoginMessage = 'Please enter password';

        } else {
            if (this.failedCount < 6) {
                if (this.failedCount < 3) {
                    this.subscriptions.push(this.homePageCall.logIn(this.user).subscribe((res: any) => {
                        
                        if (res.success && res.data != null) {
                            this.storage.set('bearer_token', res.data.bearer_token);
                            if(res.data.branch){
                                this.storage.set('isLogedIn', 1);
                                this.storage.set('studentData', res.data);
                                this.storage.set('student_token', res.data.student_token);
                                this.setBranch = false;
                                this.router.navigate(['/']);
                            } else {
                                this.setBranch = true;
                            }
                        }
                    },
                        (err) => {

                            this.failedCount++;
                            if (this.failedCount >= 3) {
                                this.addRecaptchaScript();
                                this.showCaptch = true;
                            }
                            this.LoginMessage = 'Invalid username or passowrd!';
                        }));
                } else if (this.captureVerified) {
                    this.subscriptions.push(this.homePageCall.logIn(this.user).subscribe((res: any) => {

                        if (res.success && res.data != null) {
                            this.storage.set('bearer_token', res.data.bearer_token);
                            if(res.data.branch){
                                this.storage.set('isLogedIn', 1);
                                this.storage.set('studentData', res.data);
                                this.storage.set('student_token', res.data.student_token);
                                this.setBranch = false;
                                this.router.navigate(['/']);
                            } else {
                                this.setBranch = true;
                            }
                        }
                    },
                        (err) => {

                            this.failedCount++;
                            if (this.failedCount >= 3) {
                                this.addRecaptchaScript();
                                this.showCaptch = true;
                            }
                            this.LoginMessage = err.error;
                        }));
                } else this.LoginMessage = 'Please check i am not robot check box';

            } else {
                this.lastlogin = new Date();
                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.lastlogin), environment.en_key).toString();
                localStorage.setItem('time', ciphertext);
                this.time = 90;

                const tim = localStorage.getItem('time');
                if(tim){
                    var bytes  = CryptoJS.AES.decrypt(tim, environment.en_key);
                    var originalText = bytes.toString(CryptoJS.enc.Utf8);
                    var resJson = JSON.parse(originalText);
                } else var resJson = null;
                
                this.lastlogin = new Date(resJson);
                
                this.timeNow = new Date();
                if(this.lastlogin){
                    if((this.timeNow-this.lastlogin) < (60000*90)){
                        this.time = Math.floor(90-((this.timeNow-this.lastlogin))/60000);
                    }
                    
                }
                this.LoginMessage = 'Please try after some time';
            }
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

    setBranchCode(){
        let instituteData: { [k: string]: any } = {
    
          code: this.branchCode
        };
        if(this.branchCode){
            this.subscriptions.push(this.registerService.setBranch(instituteData).subscribe((res: any) => {
            
            if(res.success){
              this.storage.set('isLogedIn', 1);
              this.storage.set('studentData', res.data);
              this.storage.set('bearer_token', res.data.bearer_token);
              this.storage.set('student_token', res.data.student_token);
              this.router.navigate(['/']);
            }
          },
              (err) => {
      
              }));
        }
    }

    ngOnDestroy(){
        if(this.subscriptions){
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

}
