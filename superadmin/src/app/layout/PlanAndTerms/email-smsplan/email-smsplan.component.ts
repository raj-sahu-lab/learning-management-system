import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { NumberFormatStyle } from '@angular/common';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { EmailSMSPlanApiHelper } from '../../../RestApiCall/ApiHelper/emailsmsplan.service';
import { HttpClient } from '@angular/common/http';
import { appApiResources } from '../../../RestApiCall/ApiHelper/app.constants';


@Component({
  selector: 'app-email-smsplan',
  templateUrl: './email-smsplan.component.html',
  styleUrls: ['./email-smsplan.component.scss']
})
export class EmailSMSPlanComponent implements OnInit {

  countryList= [];
  countryId = undefined;

  emailSMSPlanList = [];
  isEdit = false;
  emailSMSPlanId = null;

  planType = undefined;
  title = '';
  qty = 0;
  amount = 0;
  amountUSD = 0;

  constructor(public httpURL: HttpClient,protected serviceEmailSMSPlan: EmailSMSPlanApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit(): void {

    this.serviceEmailSMSPlan.getEmailSMSPlanList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.emailSMSPlanList = res.data;        
      }
    },
      (err) => {

        console.log(err);
      });

    const allCountry = appApiResources.countryCityList;

    this.httpURL.get(allCountry).subscribe((res: ServerResponse) => {

      this.countryList = res.data;

    },
      (err) => {

        console.log(err);
      });

    
      
  }

  deleteButtonClick(emailSMSPlanId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete plan?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceEmailSMSPlan.deleteEmailSMSPlan(emailSMSPlanId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.emailSMSPlanList.splice(this.emailSMSPlanList.findIndex(obj => obj.id == emailSMSPlanId), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log("NO");
    });
  }

  editButtonClick(emailSMSPlanId) {

    const plan = this.emailSMSPlanList.find(obj => obj.id == emailSMSPlanId);
    this.isEdit = true;
    this.emailSMSPlanId = plan.id;

    this.countryId = plan.country.id;
    this.planType = plan.planType;
    this.title = plan.title;
    this.qty = plan.totalCount;
    this.amount = plan.amount;
    this.amountUSD = plan.amountUSD;

    document.getElementById('startForm').scrollIntoView();
  }

  cancelEditClick() {

    this.isEdit = false;
    this.emailSMSPlanId = null;

    this.countryId = undefined;
    this.planType = undefined;
    this.title = '';
    this.qty = 0;
    this.amount = 0;
    this.amountUSD = 0;
  }

  submitButtonClick() {

    if (this.countryId == undefined) {

      this.snotify.body = 'Please select country.';
      this.snotify.onError();

    } else if (this.planType == undefined) {

      this.snotify.body = 'Please select plan type.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter plan title.';
      this.snotify.onError();

    } else if (this.qty == null || this.qty == 0) {

      this.snotify.body = 'Please enter qty.';
      this.snotify.onError();

    } else if (this.amount == null || this.amount == 0) {

      this.snotify.body = 'Please enter plan ₹ amount.';
      this.snotify.onError();

    } else if (this.amountUSD == null || this.amountUSD == 0) {

      this.snotify.body = 'Please enter plan $ amount.';
      this.snotify.onError();

    } else {

      let emailSMSPlanData: { [k: string]: any } = {

        countryId: this.countryId,
        planType: this.planType,
        title: this.title,
        totalCount: this.qty,
        amount: this.amount,
        amountUSD: this.amountUSD,
      };

      if (this.isEdit) {

        emailSMSPlanData.planId = this.emailSMSPlanId;

        this.serviceEmailSMSPlan.updateEmailSMSPlan(emailSMSPlanData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.emailSMSPlanList[this.emailSMSPlanList.findIndex(obj => obj.id == this.emailSMSPlanId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }

        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.serviceEmailSMSPlan.addEmailSMSPlan(emailSMSPlanData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.emailSMSPlanList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }

        },
          (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      }

    }
  }

}
