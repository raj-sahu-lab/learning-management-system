import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
import { ServerResponse } from 'http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
declare let Razorpay: any;
declare var $ :any;
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { StripeCardComponent, StripeInstance, StripeFactoryService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment-gate-way',
  templateUrl: './payment-gate-way.component.html',
  styleUrls: ['./payment-gate-way.component.scss']
})
export class PaymentGateWayComponent implements OnInit, OnDestroy {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  stripe: StripeInstance;

  @Output()
  payementDetails: EventEmitter<any> = new EventEmitter<any>();

  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  payPalPay: boolean = false;
  loading : boolean = false;
  paymentInfo : any;
  error: any;
  paymentData : any;

  response;
  razorpayResponse;
  private subscriptions: Subscription[] = [];
  user: any;
  type: any;
  clicked = false;

  constructor(private stripeFactory: StripeFactoryService, @Inject(SESSION_STORAGE) private storage: WebStorageService, public helperService : HelperService, private toastr: ToastrService, public paymentGateWayService : PaymentGateWayService, private cd:  ChangeDetectorRef) {
    
    this.subscriptions.push(this.paymentGateWayService.getPaymentDetails().subscribe(paymentDetails => {
      
      if(paymentDetails.offer){
        paymentDetails.amount = paymentDetails.afterDiscount;
      }

      this.setType(paymentDetails);
    }));

    this.subscriptions.push(this.paymentGateWayService.closePayementModle().subscribe(value => {
      this.payPalPay = false;
      this.loading = false;
      this.paymentData = '';
      this.type = '';
    }));

   }

  ngOnInit() {
    this.paymentGateWayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  RAZORPAY_OPTIONS = {
    "key": "",
    "amount": "",
    "currency" : "",
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

  public proceed(paymentDetails : any) {
    
    this.RAZORPAY_OPTIONS.amount = (paymentDetails.amount * 100).toString();
    this.RAZORPAY_OPTIONS.currency = paymentDetails.currency.code;
    this.RAZORPAY_OPTIONS.description = paymentDetails.title;
    this.RAZORPAY_OPTIONS.key = paymentDetails.key;
    this.user = this.storage.get('User');
    if(this.user.branch.name){
      this.RAZORPAY_OPTIONS.name = this.user.branch.name;
    } else this.RAZORPAY_OPTIONS.name = "Company";
    if(this.user.branch.account.image){
      this.RAZORPAY_OPTIONS.image = this.user.branch.account.image;
    } else this.RAZORPAY_OPTIONS.image = environment.baseUrl+"assets/img/company.png";

    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    // this.showPopup();

    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();

  }

  //on success of razorpay payment this function will run
  public razorPaySuccessHandler(response) {
    
    // this.cd.detectChanges();
    this.user = this.storage.get('User');
    const instituteId = this.user.branch.account.id;
    this.paymentInfo = {
      'accountId' : instituteId,
      'type' : this.paymentData.typeId,
      'id' : this.paymentData.id,
      'paymentGateWayId' : this.paymentData.paymentGateWayid,
      'transactionId' : response.razorpay_payment_id,
      'amount' : this.paymentData.amount,
      'currencyId' : this.paymentData.currency.id,
      'purchaseResponse' : JSON.stringify(response)
    }
    if(this.paymentData.offer){
      this.paymentInfo.amount = this.paymentData.beforeDiscount;
      this.paymentInfo.offer = this.paymentData.offer;
    }
    // this.payementDetails.emit(this.paymentInfo);
    this.helperService.startload();
    this.subscriptions.push(this.paymentGateWayService.placePurchaseorder(this.paymentInfo).subscribe((res: ServerResponse) => {
       
      if (res) {
        this.helperService.stopLoad();
        this.toastr.success('Thank you, your payment is successful. You can check the invoice from the profile settings invoice section.');
        this.payementDetails.emit(res);
      }
    },
      (err) => {
        this.helperService.stopLoad();
        this.toastr.error(err.error);
        this.setPayemtDetailsToLocalStorage();
      })); 

  }

  setType(paymentDetails :any){
    this.paymentData = '';
    this.type = '';
    this.user = this.storage.get('User');
    if (paymentDetails.payementGateWayname == "Stripe") {
      this.loading = true;
      this.stripe = this.stripeFactory.create(paymentDetails.key);
    }

    if(paymentDetails.type == 'subject'){
      paymentDetails.typeId = 1;
    } else if(paymentDetails.type == 'topic'){
      paymentDetails.typeId = 2;
    } else if(paymentDetails.type == 'content'){
      paymentDetails.typeId = 3;
    } else if(paymentDetails.type == 'test'){
      paymentDetails.typeId = 4;
    } else if(paymentDetails.type == 'practice'){
      paymentDetails.typeId = 5;
    } else if(paymentDetails.type == 'pdf'){
      paymentDetails.typeId = 6;
    } else if(paymentDetails.type == 'ppt'){
      paymentDetails.typeId = 7;
    } else if(paymentDetails.type == 'audio'){
      paymentDetails.typeId = 8;
    } else if(paymentDetails.type == 'video'){
      paymentDetails.typeId = 9;
    } else if(paymentDetails.type == 'bundle'){
      paymentDetails.typeId = 10;
    } else paymentDetails.typeId = '';
    this.paymentData = paymentDetails;
    
    if(paymentDetails.payementGateWayname == "Razorpay"){
      this.proceed(paymentDetails);
    }
    if(paymentDetails.payementGateWayname == "PayPal"){
      this.loading = true;
      this.initConfig(paymentDetails);
    }
    if (paymentDetails.payementGateWayname == "Stripe") {
      this.loading = false;
      this.type = "Stripe";
    }
  }

  private initConfig(paymentDetails): void {
            
    if(paymentDetails.payementGateWayname == "PayPal"){
      this.payPalPay = true;
      this.payPalConfig = {
        currency: paymentDetails.currency.code,
        clientId: paymentDetails.key,
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: paymentDetails.currency.code,
                value: paymentDetails.amount,
                breakdown: {
                  item_total: {
                    currency_code: paymentDetails.currency.code,
                    value: paymentDetails.amount
                  }
                }
              },
              items: [
                {
                  name: paymentDetails.title,
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: paymentDetails.currency.code,
                    value: paymentDetails.amount,
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
          
          actions.order.get().then(details => {
            this.user = this.storage.get('User');
            const instituteId = this.user.branch.account.id;
            // console.log('onApprove - you can get full order details inside onApprove: ', details);
            this.paymentInfo = {
              'accountId' : instituteId,
              'type' : paymentDetails.typeId,
              'id' : paymentDetails.id,
              'paymentGateWayId' : paymentDetails.paymentGateWayid,
              'transactionId' : details.id,
              'amount' : paymentDetails.amount,
              'currencyId' : paymentDetails.currency.id,
              'purchaseResponse' : JSON.stringify(details)
            }
            if(paymentDetails.offer){
              this.paymentInfo.amount = paymentDetails.beforeDiscount;
              this.paymentInfo.offer = paymentDetails.offer;
            }

          });
        },
        onClientAuthorization: (data : any) => {
          this.helperService.startload();
          this.subscriptions.push(this.paymentGateWayService.placePurchaseorder(this.paymentInfo).subscribe((res: ServerResponse) => {
            this.helperService.stopLoad();
            this.payementDetails.emit(res); 
            this.payPalPay = false;
            if (res) {
              this.toastr.success('Thank you, your payment is successful. You can check the invoice from the profile settings invoice section.');
            }
          },
            (err) => {
              this.helperService.stopLoad();
              this.toastr.error(err.error);
              this.setPayemtDetailsToLocalStorage();
              this.payPalPay = false;

            }));

          this.showSuccess = true;
        },
        onCancel: (data, actions) => {
          this.payPalPay = false;
          this.toastr.error('Transaction canceled');

          // this.payementDetails.emit(data); 
          $('.modal').modal('hide');

        },
        onError: err => {
          this.payPalPay = false;
          this.error = err.error;
          // this.payementDetails.emit(err); 
          $('.modal').modal('hide');

        },
        onClick: (data, actions) => {
          // this.payementDetails.emit(data); 

        },
      };
    }
    setTimeout(() => {
      this.loading = false;
     }, 2000);

  }

  setPayemtDetailsToLocalStorage(){
    this.storage.set('paymentDetails',this.paymentInfo);
  }

  stripToken(): void {
    let name = this.user.firstName;
    this.stripe.createToken(this.card.element, { name }).subscribe((result) => {
      if (result.token) {
        this.clicked = true;
        // Use the token
        const instituteId = this.user.branch.account.id;
        this.paymentInfo = {
          'accountId': instituteId,
          'type': this.paymentData.typeId,
          'id': this.paymentData.id,
          'paymentGateWayId': this.paymentData.paymentGateWayid,
          'currencyId': this.paymentData.currency.id,
          'currency': this.paymentData.currency.code,
          'stripeToken': result.token.id,
          'amount': this.paymentData.amount,
          'beforeDiscount': this.paymentData.amount
        }
        if (this.paymentData.offer) {
          this.paymentInfo.beforeDiscount = this.paymentData.beforeDiscount;
          this.paymentInfo.offer = this.paymentData.offer;
        }
        // this.helperService.startload();
        this.subscriptions.push(this.paymentGateWayService.stripePurchaseorder(this.paymentInfo).subscribe((res: ServerResponse) => {
          this.clicked = false;
          if (res) {
            // this.helperService.stopLoad();
            this.toastr.success('Thank you, your payment is successful. You can check the invoice from the profile settings invoice section.');
            this.payementDetails.emit(res);
          }
        },
          (err) => {
            // this.helperService.stopLoad();
            this.toastr.error(err.error);
          }));
      } else if (result.error) {
        // Error creating the token
        this.toastr.error(result.error.message);
      }
    });
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
