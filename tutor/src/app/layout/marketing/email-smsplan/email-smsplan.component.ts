import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { EmailSMSplanApiHelper } from '../../../RestApiCall/ApiHelper/emailSMSplan.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface'; 
import { Location } from '@angular/common';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
declare let Razorpay: any;
declare var $ :any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-email-smsplan',
  templateUrl: './email-smsplan.component.html',
  styleUrls: ['./email-smsplan.component.scss']
})
export class EmailSMSplanComponent implements OnInit {

  emailSmsId : any;
  emailSMSPlans : any;
  paymentMode = 2;
  selectedPreview: any;
  user :any;
  currentDate : any;

  payPalConfig?: IPayPalConfig;
  gst = 18;
  gstAmt = 0;
  total = 0;
  gatewayId = undefined;
  gatewayList = [];
  transId : any;

  token : any;

  constructor(public router : Router, protected service: AuthApiHelper, private route: ActivatedRoute, public snotify: TostNotificationService, public emailSMS : EmailSMSplanApiHelper, public helperService: HelperService, private location: Location, protected servicePaymentGateWay: PaymentgatewayApiHelper) {
    this.emailSmsId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    window.scroll(0,300);
    this.user = JSON.parse(localStorage.getItem('User'));
    this.currentDate = new Date().toISOString().slice(0, 16);

    this.getEmailSmsPlans(this.emailSmsId);

    this.getPaymentMethods();

    this.initPaypalConfig();
    // laod razor pay js file
    this.helperService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  getEmailSmsPlans(id) {

    this.emailSMS.getSMSEmailPlans(id).subscribe((res: ServerResponse) => {
      if (res.success && res.data != null) {
        this.emailSMSPlans = res.data;
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

      });

  }

  getPaymentMethods(){
    this.token = localStorage.getItem('logintoken');

    this.service.getAllTermList(this.token).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        this.gatewayList = res.data.gatewayList;
      }
    },
      (err) => {

        console.log('Error');
      });
  }

  goBack(){
    this.location.back();
  }

  initPaypalConfig(){
    /*paypal Config*/
    this.payPalConfig = {

      currency: this.paymentMode ==1 ? 'INR' : 'USD',
      
      clientId: 'AfAWXffeMyCfQ1azSEYXEHxnFT2aGkBCpR_5v3pFG3EOg_CA_oKbEdcHCQWbqk7bIH1NqaQPVwJEiNUC',

      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.paymentMode ==1 ? 'INR' : 'USD',
              value: this.total.toString(),
              breakdown: {
                item_total: {
                  currency_code: this.paymentMode ==1 ? 'INR' : 'USD',
                  value: this.total.toString()
                }
              }
            },
            items: [
              {
                name: this.selectedPreview.title,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: this.paymentMode ==1 ? 'INR' : 'USD',
                  value: this.total.toString(),
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          this.transId = details.id
          // console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        this.purchasePlan(this.transId);
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        // console.log('OnCancel', data, actions);
        this.snotify.body = 'Payment cancel try after some time.';
        this.snotify.onError();
      },
      onError: err => {
        // console.log('OnError', err);
        this.snotify.body = 'Something went wrong please try again.';
        this.snotify.onError();
      },
      onClick: (data, actions) => {
        // console.log('onClick', data, actions);
      },
    };
    /*paypal Config*/
  }

  // razor pay setting
  RAZORPAY_OPTIONS = {
    "key": "",
    "amount": "",
    "currency":"",
    "name": "",
    "order_id": "",
    "description": "",
    "image": "",
    "prefill": {
      "name": "",
      "email": "",
      "contact": "",
      "method": ""
    },
    "modal": {},
    "theme": {
      "color": "#0096C5"
    }
  };

  public proceedRazorPay() {
    
    let amount = Math.floor(this.total * 100); // amount in paisa
    this.RAZORPAY_OPTIONS.key = "rzp_live_XXXXXXXXXXXXXX", //"rzp_test_XXXXXXXXXXXXXX";//rzp_live_XXXXXXXXXXXXXX;
    
    this.RAZORPAY_OPTIONS.amount = amount.toString();
    this.RAZORPAY_OPTIONS.currency = this.paymentMode ==1 ? 'INR' : 'USD';
    this.RAZORPAY_OPTIONS.description = this.selectedPreview.title;

    const user = JSON.parse(localStorage.getItem('User'));
    if(user.account_title){
      this.RAZORPAY_OPTIONS.name = user.account_title;
    } else this.RAZORPAY_OPTIONS.name = "Company";
    if(user.account_image){
      this.RAZORPAY_OPTIONS.image = user.account_image;
    }
    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    // this.showPopup();
    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();

  }

  //on success of razorpay payment this function will run
  public razorPaySuccessHandler(response) {
    
    // this.cd.detectChanges();
    this.purchasePlan(response.razorpay_payment_id);

  }
  // end of razor pay related code

  showPreview(index) {

    this.selectedPreview = this.emailSMSPlans[index];

    if(this.paymentMode == 1) {

      this.gstAmt = this.selectedPreview.amount * this.gst/100;      
      this.total = Math.ceil((this.selectedPreview.amount + this.gstAmt)* 100 )/100;

    } else {

      this.total = this.selectedPreview.amountUSD;
    }

  }

  hidePreview() {
    this.selectedPreview = '';
  }

  purchasePlan(transactionId) {
    // $(".ngx-overlay").css({ display : none });
    if(this.emailSmsId == 1) {
      
      const data = {
        "transactionId" : transactionId,
        "totalEmail" : this.selectedPreview.totalCount
      }
      this.helperService.startload();
      this.emailSMS.buyEmail(data).subscribe((res: ServerResponse) => {
        $('.ngx-overlay').css('display','none');
        this.helperService.stopLoad();
        window.scroll(0,500);

        if (res.success) {

          let closeReview: HTMLElement = document.getElementById('closePreview') as HTMLElement;
          closeReview.click();
          this.hidePreview();

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          this.router.navigate(['/email']).then(()=>{
            window.scroll(0,500);
          });
        }
      },
        (err) => {
  
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }

    if(this.emailSmsId == 2) {

      const data = {
        "transactionId" : transactionId,
        "totalSMS" : this.selectedPreview.totalCount
      }
      this.helperService.startload();
      this.emailSMS.buySMS(data).subscribe((res: ServerResponse) => {
        $('.ngx-overlay').css('display','none');
        this.helperService.stopLoad();
        window.scroll(0,500);

        if (res.success) {
          let closeReview: HTMLElement = document.getElementById('closePreview') as HTMLElement;
          closeReview.click();
          this.hidePreview();

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          this.router.navigate(['/sms']).then(()=>{
            window.scroll(0,500);
          });
        }
      },
        (err) => {
  
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }

  }

}
