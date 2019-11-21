import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-paymentgateway',
  providers: [PaymentgatewayApiHelper],
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.scss']
})
export class PaymentgatewayComponent implements OnInit {

  paymentgatewayList = [];
  PaymentgatewayTitleList = [];
  isEdit = false;
  paymentgatewayId = null;
  editIndex = null;

  title = undefined;
  key = '';
  secret = '';
  status = 0;

  loggedIn : any;
  public userType: number;

  constructor(public router: Router, protected servicePaymentgateway: PaymentgatewayApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if (this.userType !== 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.servicePaymentgateway.getPaymentGateWayList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.paymentgatewayList = res.data.gateWay;
      }
    },
      (err) => {

        console.log(err);
      });

    this.servicePaymentgateway.getPaymentgatewayTitleList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.PaymentgatewayTitleList = res.data;
      }
    },
    (err) => {

      console.log(err);
    });
  }

  editButtonClick(index) {

    const paymentgateway = this.paymentgatewayList[index];
    this.isEdit = true;
    this.paymentgatewayId = paymentgateway.id;
    this.editIndex = index;

    this.title = paymentgateway.title;
    this.key = paymentgateway.key;
    this.secret = paymentgateway.secret;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.paymentgatewayId = null;
    this.editIndex = null;

    this.title = undefined;
    this.key = '';
    this.secret = '';
  }

  submitButtonClick() {

    if (this.title == 'OfflinePay') {

      this.key = 'OfflinePay';
      this.secret = 'OfflinePay';
    }

    if (this.title == undefined) {

      this.snotify.body = 'Please select Paymentgateway.';
      this.snotify.onError();

    } else if (this.key == '') {

      this.snotify.body = 'Please enter private API key.';
      this.snotify.onError();

    } else if (this.secret == '') {

      this.snotify.body = 'Please enter private secret key.';
      this.snotify.onError();

    } else if ((this.title == 'Razorpay') && (!this.key.startsWith('rzp_'))) {

      this.snotify.body = 'Please enter valid private key.';
      this.snotify.onError();

    } else if ((this.title == 'Razorpay') && (!this.secret.startsWith('rzp_'))) {

      this.snotify.body = 'Please enter valid private secret key.';
      this.snotify.onError();

    } else {

      const paymentgatewayData: {[k: string]: any} = {

        title: this.title,
        key: this.key,
        secret: this.secret,
        status: this.status,

      };

      if (this.isEdit) {

        paymentgatewayData.id = this.paymentgatewayId;

        this.servicePaymentgateway.updatePaymentgateway(paymentgatewayData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.paymentgatewayList[this.editIndex] = res.data;
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.servicePaymentgateway.addPaymentgateway(paymentgatewayData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.paymentgatewayList.unshift(res.data);
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
