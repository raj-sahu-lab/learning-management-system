import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiHelper } from '../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../RestApiCall/NetworkLayer/toast-notification.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
declare let Razorpay: any;
declare var $ :any;
import { HelperService } from '../RestApiCall/NetworkLayer/helper.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-plan-purchase',
  templateUrl: './plan-purchase.component.html',
  styleUrls: ['./plan-purchase.component.scss'],
  providers: [AuthApiHelper],
})
export class PlanPurchaseComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  selectedPreview: any;
  user :any;
  currentDate : any;

  token = '';
  title = '';
  allTermList = [];
  gatewayList = [];
  paymentMode = 2;
  currentTerm: any;
  selectedPlanIndex = 0;
  couponCode = '';
  offerId = null;
  discount = 0;
  discountAmt = 0;
  gst = 18;
  gstAmt = 0;
  total = 0;
  gatewayId = undefined;

  showSuccess = true;
  showCancel = true;
  showError = true;

  constructor(public helperService: HelperService, protected service: AuthApiHelper, public router: Router, private route: ActivatedRoute, public snotify: TostNotificationService) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('User'));
    this.currentDate = new Date().toISOString().slice(0, 16);

    this.token = this.route.snapshot.paramMap.get('token');
    
    this.service.getAllTermList(this.token).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.allTermList = res.data.termsAndPlan;
        this.gatewayList = res.data.gatewayList;
        
        this.currentTerm = this.allTermList[this.selectedPlanIndex];
      }
    },
      (err) => {

        console.log('Error :', err);
      });


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
                name: this.currentTerm.title+' - '+this.selectedPreview.title,
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
          // console.log('onApprove - you can get full order details inside onApprove: ', details);

         this.purchasePlan(details.id);

        });
      },
      onClientAuthorization: (data) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        // console.log('OnCancel', data, actions);
        // console.log(this.payPalConfig);
        //this.purchasePlan(data.orderID);

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

    // laod razor pay js file
    this.helperService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
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
    this.RAZORPAY_OPTIONS.key = environment.razorPayKey, //rzp_live_XXXXXXXXXXXXXX, rzp_test_XXXXXXXXXXXXXX;
    
    this.RAZORPAY_OPTIONS.amount = amount.toString();
    this.RAZORPAY_OPTIONS.currency = this.paymentMode ==1 ? 'INR' : 'USD';
    this.RAZORPAY_OPTIONS.description = this.currentTerm.title+' - '+this.selectedPreview.title;

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

  termClicked(index) {

    if (this.selectedPlanIndex !== index) {

      this.selectedPlanIndex = index;
      
      this.currentTerm = this.allTermList[this.selectedPlanIndex];

    }

  }

  showPreview(index) {

    this.selectedPreview = this.currentTerm.plan[index];

    if(this.paymentMode == 1) {

      this.gstAmt = this.selectedPreview.amount * this.gst/100;      
      this.total = Math.ceil((this.selectedPreview.amount + this.gstAmt)* 100 )/100;
      //this.total = 1.00;

    } else {

      this.total = this.selectedPreview.amountUSD;
    }

  }

  hidePreview() {

    this.selectedPreview = '';
    this.discount = 0;
    this.discountAmt = 0;
  }

  checkCoupon() {

    if (this.couponCode == '') {

      this.snotify.body = 'Please enter offer code.';
      this.snotify.onError();

    } else {

      this.service.checkOfferCode(this.token, this.couponCode, this.currentTerm.id).subscribe((res: ServerResponse) => {

        if (res.success && res.data != null) {
          
          this.offerId = res.data.id;
          this.discount = res.data.discount;

          if(this.paymentMode == 1) {

            this.discountAmt = this.selectedPreview.amount * this.discount/100;

            if(this.discountAmt>res.data.maxAmount)
            {
              this.discountAmt = res.data.maxAmount;
            }
            
            this.gstAmt = (this.selectedPreview.amount - this.discountAmt) * this.gst/100;
            this.total = Math.ceil((this.selectedPreview.amount- this.discountAmt + this.gstAmt) * 100)/100;
            
          } else {

            this.discountAmt = this.selectedPreview.amountUSD * this.discount/100;

            if(this.discountAmt>res.data.maxDollerAmount)
            {
              this.discountAmt = res.data.maxDollerAmount;
            }

            this.total = Math.ceil((this.selectedPreview.amountUSD - this.discountAmt) * 100)/100;
          }
          
          this.snotify.body = 'Offer code applyed successfully.';
          this.snotify.onSuccess();
          this.couponCode = '';
        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

        });
    }

  }

  purchasePlan(transactionId) {
    
    const planData: { [k: string]: any } = {

      termId: this.currentTerm.id,
      planId: this.selectedPreview.id,
      gst: this.gst,
      currencyType: this.paymentMode,
      gatewayId: this.gatewayId,
      transactionId: transactionId,
      offerId: this.offerId,
    };

    this.service.purchasePlan(planData, this.token).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.hidePreview();
        
        // localStorage.setItem('isLoggedin', 'true');
        // localStorage.setItem('logintoken', res.data.bearer_token);
        // localStorage.setItem('User', JSON.stringify(res.data));

        //this.router.navigate(['/dashboard']);
        
        // $("#mdl").addClass("d-none");
        // this.router.navigate(['/dashboard']).then(()=>{
        //   location.reload();
        // });

        this.snotify.body = "Plan purchased successfully! Login again";
        this.snotify.onSuccess();

        localStorage.removeItem('loggedIn');
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('logintoken');
        localStorage.removeItem('User');

        this.router.navigate(['/login']);

      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();
      });

  }

}
