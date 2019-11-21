import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingApiHelper } from '../../../RestApiCall/ApiHelper/Setting.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-setting',
  providers: [SettingApiHelper],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  settingList:any;

  public title: string;
  public token: string;
  public picture: string;
  public countryCode: string;
  public phone: string;
  public email: string;
  public razerPaySubscriptionId: string;

  sign ='';
  startDate ='';
  endDate ='';
  planTitle ='';
  termTitle ='';
  amount = 0;
  gst ='';
  gstAmount ='';
  total ='';
  discount ='';
  grandTotal ='';

  loggedIn : any;
  public userType: number;

 constructor(public router: Router,protected servicesetting: SettingApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }
    
    this.title = User.account_title;  
    this.token = User.bearer_token;  
    this.picture = User.account_image;
    this.countryCode = User.countryCode;
    this.phone = User.account_phone;
    this.email = User.account_email;
    this.razerPaySubscriptionId = User.razerPaySubscriptionId;
    //console.log(this.razerPaySubscriptionId);

    this.servicesetting.getSettingList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.settingList = res.data;
        
        this.sign = this.settingList.lastPlan.currency.sign;
        this.startDate = this.settingList.lastPlan.startDate;
        this.endDate = this.settingList.lastPlan.endDate;
        this.planTitle = this.settingList.lastPlan.title;
        this.termTitle = this.settingList.lastPlan.term.title;
        this.amount = this.settingList.lastPlan.amount;
        this.gst = this.settingList.lastPlan.gst;
        this.gstAmount = this.settingList.lastPlan.gstAmount;
        this.total = this.settingList.lastPlan.total;
        this.discount = this.settingList.lastPlan.discount;
        this.grandTotal = this.settingList.lastPlan.grandTotal;

      }
    },
      (err) => {

        console.log(err);
      });

  }

  cancelSubscription() {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to cancel subscription?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicesetting.cancelSubscription().subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }
}
