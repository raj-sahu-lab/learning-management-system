import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { SMSApiHelper } from '../../../RestApiCall/ApiHelper/SMS.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  Math = Math;
  filter = false;

  learnerList = [];
  smsType = '0';

  numbersList = [];
  copyNumber = '';
  sendNumber: any;

  sendSMSType = 'dnd';
  title = '';
  description = '';

  totalSMS = null;
  totalSentSMS = null;
  remainSMS = null;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router, protected serviceLearner: LearnerApiHelper, protected serviceSMS: SMSApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;

    if (this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceLearner.getLearnerList('1').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.totalSMS = res.data.totalSMS;
        this.totalSentSMS = res.data.totalSentSMS;
        this.remainSMS = res.data.remainSMS;

        this.learnerList = res.data.learnerList;
        this.learnerList.forEach(learner => {
          learner.selected = false;
        });
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  numberChecked(phone, event) {

    if (event.target.checked) {

      this.numbersList.push(phone);
    }

    if (!event.target.checked) {

      const index = this.numbersList.indexOf(phone);

      if (index > -1) {

        this.numbersList.splice(index, 1);
      }
    }

  }

  allChecked( event) {

    this.numbersList = [];

    this.learnerList.forEach(number => {


      if (event.target.checked) {

        number.selected = true;
        this.numbersList.push(number.countrycode + number.phone);
      } else {

        this.numbersList = [];
        number.selected = false;
      }

    });

  }

  submitButtonClick() {

    if (this.smsType == '0') {
        this.sendNumber = this.numbersList;

    } else if (this.smsType == '1') {

        const copyNumber = this.copyNumber;
        this.sendNumber = copyNumber.split('\n');
    }

    if (this.smsType == '0' && this.remainSMS < this.numbersList.length) {

      this.snotify.body = 'You can not select more then remaining SMS.';
      this.snotify.onError();

    } else if (this.smsType == '1' && this.remainSMS < this.copyNumber.split(',').length) {

      this.snotify.body = 'You can not copy more then remaining SMS.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter SMS title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter sms description.';
      this.snotify.onError();

    } else if (this.sendNumber.length > 10000) {

      this.snotify.body = 'Please select or paste maximum 10000.';
      this.snotify.onError();

    } else {

      const smsData: {[k: string]: any} = {

        // smsType: this.sendSMSType,
        title: this.title,
        description: this.description,
        numbers: this.sendNumber
      };

      this.serviceSMS.sendSMS(smsData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.sendNumber = '';
        // this.sendSMSType = 'dnd';
        this.title = '';
        this.description = '';
        this.copyNumber = '';
        this.numbersList = [];

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });

    }
  }

}
