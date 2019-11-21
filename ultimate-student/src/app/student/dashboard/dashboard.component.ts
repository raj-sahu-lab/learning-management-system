import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { HttpClient } from '@angular/common/http';

import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { ProfileService } from './../../RestApiCall/ApiHelper/profile.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuid } from 'uuid';
import { PushNotificationService } from './../../RestApiCall/ApiHelper/push-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  countryList= [];
  cityList= [];

  activeGender = null;
  countryId:any;

  public firstName: string;
  public lastName: string;
  public phone: string;
  public branch: string;

  private flag: boolean;
  DashboardList: any;
  defaultInstitute = true;
  pinCode : any;
  citySelected : any;
  countrySelected : any;
  gender : any;
  profileUpdateError : boolean = false;
  errorMessage : any;
  instituteListSelected: any;
  defaultInstituteSelected: any;
  redirectId : any = {};
  token: any;
  subId: any;
  instituteLogo : any;
  notificationToken : any = '';
  auth = false;
  accessToken : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public httpURL: HttpClient,protected serviceDashboard: DashboardApiHelper, public router: Router, public helperService: HelperService, public profileService : ProfileService, public route : ActivatedRoute, private toastr: ToastrService, public pushNotificationService: PushNotificationService) {
    this.phone = this.route.snapshot.queryParamMap.get('phone');
    this.accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    this.subscriptions.push(this.pushNotificationService.getToken().subscribe(token => {
      this.notificationToken = token;
    }));
    if(this.phone && this.accessToken){
      this.storage.clear();
      setTimeout(() => {
        this.getAuthDataByPhone();
      }, 200);
    } else if(!this.storage.get('logintoken')){
      if(!this.phone || !this.accessToken){
        this.router.navigate(['access-denied']);
      }
    }
   }

  ngOnInit() {
    if(this.storage.get('logintoken')){
      this.auth = true;
      const user = this.storage.get('User');
      this.instituteLogo = user.branch.account.image;
      
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.phone = user.phone;
      this.gender = user.gender;
      var instituteSelected = user.branch;
      this.branch = instituteSelected.name;
      this.dashBoard();
    }
  }

  dashBoard() {
    
    this.subscriptions.push(this.serviceDashboard.getDashboardList().subscribe((res: ServerResponse) => {
      // console.log(res);
      
      if (res && res.success && res.data != null) {
        
        this.DashboardList = res.data;
        this.DashboardList.courseList.forEach(subject => {
          if(subject.purchase){
            if(subject.purchase.remainHours){
              subject.purchase.remainTime = this.hoursminute(subject.purchase.remainHours);
            }
          }
        });
        
      }
      if(!res){
        this.DashboardList = '';
      }
    },
      (err) => {
        console.log(err);

        this.defaultInstitute = false;
        this.toastr.error(err.error);

      }));
  }

  subjectDetails(cource) {
    
    this.DashboardList.courseList.forEach(subject => {

      if (cource.id == subject.id) {
        if (subject.isPaid == 1 && !cource.purchase) {
          this.router.navigate(['./student/subject/']).then(()=>{
            this.storage.set('subjectId',cource.id);
            this.redirectionService.sendDashBoardToSub(cource.id);
          });

        } else {
          this.router.navigate(['./student/topic/']).then(()=>{
            this.storage.set('topicId',cource.id);
            this.redirectionService.sendDashBoardToTopic(cource.id);
          });

        }
      }
    });
  }


  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
  }

  getAuthDataByPhone(){
    if(this.phone && this.accessToken){
      let uuidRandom = uuid();
      this.storage.set('uid', uuidRandom);

      let data = {
        'phone' : this.phone,
        'notificationToken' : this.notificationToken ? this.notificationToken : '',
        'deviceType' : 3,
        'deviceId' : uuidRandom,
        'accessToken' : this.accessToken
      }
      
      this.subscriptions.push(this.serviceDashboard.getAuthData(data).subscribe((res: ServerResponse) =>{

        
        if(res.success && res.data){
          this.storage.set('logintoken', res.data.bearer_token);
          this.storage.set('User', res.data);
          this.helperService.userData();
          this.auth = true;
          const user = res.data;
          this.instituteLogo = user.branch.account.image;
          
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.phone = user.phone;
          this.gender = user.gender;
          var instituteSelected = user.branch;
          this.branch = instituteSelected.name;
          this.dashBoard();
        }
      },
      (err) => {
        this.toastr.error(err.error);
        this.errorMessage = err.error;
        this.auth = false;
        if(err){
          this.storage.set('error',err.error);
        }
        this.router.navigate(['access-denied']);
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
