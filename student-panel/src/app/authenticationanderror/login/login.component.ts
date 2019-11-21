import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthApiHelper } from '../../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { PushNotificationService } from './../../RestApiCall/ApiHelper/push-notification.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthApiHelper],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit, OnDestroy {

    @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

    user = { phone: '', password: '', notificationToken: '', deviceType: 3, deviceId:'' };
    LoginMessage = '';
    failedCount: number = 0;
    showCaptch: boolean = false;
    captureVerified: boolean = false;
    key = environment.googleCpatchKey;
    lastlogin : any;
    timeNow : any;
    time:any;
    notificationMessage = true;
    private subscriptions: Subscription[] = [];

    constructor(protected service: AuthApiHelper, public router: Router, public pushNotificationService: PushNotificationService, public paymentGateWayService: PaymentGateWayService, private toastr: ToastrService) {
        this.subscriptions.push(this.pushNotificationService.getToken().subscribe(token => {
            this.notificationMessage = false;
            this.user.notificationToken = token;
        }));
    }

    ngOnInit() {
        setTimeout(()=>{
            this.notificationMessage = false;
        },4000);

        this.lastlogin = new Date(localStorage.getItem('time'));
        this.timeNow = new Date();
        if(this.lastlogin){
            if((this.timeNow-this.lastlogin) < (60000*90)){
                this.time = Math.floor(90-((this.timeNow-this.lastlogin))/60000);
            }
            
        }

        this.pushNotificationService.requestPermission();
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

    onLoggedin() {

        let uuidRandom = uuid();
        if(uuidRandom){
            
            this.user.deviceId = uuidRandom;
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(uuidRandom), environment.en_key).toString();
            localStorage.setItem('uid', ciphertext);
        }

        if (this.user.phone === '') {

            this.LoginMessage = 'Please enter mobile number';

        } else if (this.user.password === '') {

            this.LoginMessage = 'Please enter password';

        } else {
            if (this.failedCount < 6) {
                if (this.failedCount < 3) {
                    this.subscriptions.push(this.service.login(this.user).subscribe((res: ServerResponse) => {
                        
                        if (res.success && res.data != null) {

                            this.LoginMessage = '';
                            localStorage.setItem('logintoken', res.data.bearer_token);
                            localStorage.setItem('User', JSON.stringify(res.data));
                            const user = JSON.parse(localStorage.getItem('User'));

                            localStorage.setItem('id', JSON.stringify({ 'subjectId': '', 'topicId': '', 'contentId': '', 'contentDetailsId': '', 'testId': '', 'resultId': '', 'pollId': '', 'practiceTestId': '', 'forumCatId': '', 'forumSubId': '', 'forumArtId': '', 'forumTopId': '', 'supportId': '', 'liveClassId': '' }));

                            if (res.data.branch == null) {
                                this.router.navigate(['./addInstitute']);
                            } else {

                                localStorage.setItem('isLoggedin', 'true');
                                this.router.navigate(['./student/dashboard']);

                            }
                            // if (res.data.instituteList.length == 0) {
                            //     this.router.navigate(['./addInstitute/0']);
                            // } else {

                            //     if (res.data.branch == null) {
                            //         this.router.navigate(['./addInstitute/1']);
                            //     } else {

                            //         localStorage.setItem('isLoggedin', 'true');
                            //         this.router.navigate(['./student/dashboard']);

                            //     }


                            // }

                        } else {
                            this.LoginMessage = res.message;
                        }
                    },
                        (err) => {
                            
                            this.failedCount++;
                            if (this.failedCount >= 3) {
                                this.addRecaptchaScript();
                                this.showCaptch = true;
                            }
                            this.LoginMessage = err.error;
                            this.toastr.error(err.error);
                        }));
                } else if (this.captureVerified) {
                    this.subscriptions.push(this.service.login(this.user).subscribe((res: ServerResponse) => {

                        if (res.success && res.data != null) {

                            this.LoginMessage = '';
                            localStorage.setItem('logintoken', res.data.bearer_token);
                            localStorage.setItem('User', JSON.stringify(res.data));
                            const user = JSON.parse(localStorage.getItem('User'));

                            localStorage.setItem('id', JSON.stringify({ 'subjectId': '', 'topicId': '', 'contentId': '', 'contentDetailsId': '', 'testId': '', 'resultId': '', 'pollId': '', 'practiceTestId': '', 'forumCatId': '', 'forumSubId': '', 'forumArtId': '', 'forumTopId': '', 'supportId': '', 'liveClassId': '' }));

                            if (res.data.instituteList.length == 0) {
                                this.router.navigate(['./addInstitute/0']);
                            } else {

                                if (res.data.branch == null) {
                                    this.router.navigate(['./addInstitute/1']);
                                } else {

                                    localStorage.setItem('isLoggedin', 'true');
                                    this.router.navigate(['./student/dashboard']);

                                }


                            }

                        } else {
                            this.LoginMessage = res.message;
                        }
                    },
                        (err) => {

                            this.failedCount++;
                            if (this.failedCount >= 3) {
                                this.addRecaptchaScript();
                                this.showCaptch = true;
                            }
                            this.LoginMessage = err.error;
                            this.toastr.error(err.error);
                        }));
                } else this.LoginMessage = 'Please check i am not robot check box';

            } else {
                this.lastlogin = new Date();
                localStorage.setItem('time',this.lastlogin);
                this.time = 90;
                this.lastlogin = new Date(localStorage.getItem('time'));
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
