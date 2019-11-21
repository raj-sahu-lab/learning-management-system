import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { CouponApiHelper } from '../../../RestApiCall/ApiHelper/Coupon.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  filter: boolean = false;

  isEdit = false;
  editIndex = null;
  couponList = [];
  couponId: any;

  subjectList = [];
  subjectId: any;

  currencyList = [];
  currencyId = undefined;

  offerType = undefined;
  title = '';
  code = '';
  noOfUsers = '';
  discount = '';
  maxDiscountAmount = '';
  minimumBuyAmount = '';
  sDate = '';
  eDate = '';

  status = '0'

  columType = true;
  columSubject = true;
  columTitle = true;
  columCode = true;
  columUsers = true;
  columDiscount = true;
  columMaxAmount = true;
  columMinimumAmountt = true;
  columMinimumBuyAmountt = true;
  columStartDate = false;
  columEndDate = false;
  columStatus = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(protected serviceCurrency: CurrencyApiHelper,public router: Router,protected serviceSubject: SubjectApiHelper, protected serviceCoupon: CouponApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    this.currencyId = User.currency_id;

    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }


    // Get Subject List
    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res.success != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.serviceCoupon.getCouponList().subscribe((res: ServerResponse) => {

      if (res.success != null && res.success && res.data != null) {
        
        this.couponList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });


  this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

    if (res != null && res.success && res.data != null) {
      
      this.currencyList = res.data;
    }
  },
    (err) => {

      console.log(err);
    });

  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.editIndex = null;
    this.couponId = null;
    this.subjectId = undefined;

    this.offerType = undefined;
    this.title = '';
    this.code = '';
    this.noOfUsers = '';
    this.discount = '';
    this.currencyId = this.currencyId;
    this.maxDiscountAmount = '';
    this.minimumBuyAmount = '';
    this.sDate = '';
    this.eDate = '';

    this.status = '0';
  }

  editButtonClick(index) {

    const coupon = this.couponList[index];
    
    this.editIndex = index;
    this.isEdit = true;
    this.couponId = coupon.id;
    this.subjectId = coupon.subject.id;
    this.offerType = coupon.type;
    this.title = coupon.title;
    this.code = coupon.code;
    this.noOfUsers = coupon.users;
    this.discount = coupon.discount;
    this.currencyId = coupon.currency.id;
    this.maxDiscountAmount = coupon.maxAmount;
    this.minimumBuyAmount = coupon.minBuyAmount;
    this.sDate = coupon.startDate;
    this.eDate = coupon.endDate;
    this.status = coupon.status ? coupon.status.toString() : '0';
  }

  submitButtonClick() {

    if (this.offerType == undefined) {

      this.snotify.body = 'Please select coupon offer type.';
      this.snotify.onError();

    } else if (this.subjectId == undefined) {

      this.snotify.body = 'Please select course bundle.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter coupon title.';
      this.snotify.onError();

    } else if (this.code == '') {

      this.snotify.body = 'Please enter coupon code.';
      this.snotify.onError();

    } else if (this.noOfUsers == '') {

      this.snotify.body = 'Please enter no of Users.';
      this.snotify.onError();

    } else if (this.discount == '') {

      this.snotify.body = 'Please enter discount.';
      this.snotify.onError();

    } else if (this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else if (this.maxDiscountAmount == '') {

      this.snotify.body = 'Please enter max discount amount.';
      this.snotify.onError();

    } else if (this.minimumBuyAmount == '') {

      this.snotify.body = 'Please enter minimum buy amount.';
      this.snotify.onError();

    } else if (this.sDate == '') {

      this.snotify.body = 'Please select start date.';
      this.snotify.onError();

    } else if (this.eDate == '') {

      this.snotify.body = 'Please select end date.';
      this.snotify.onError();

    } else {

      let coupon: { [k: string]: any } = {

        type: this.offerType,
        subjectId: this.subjectId,
        title: this.title,
        code: this.code,
        noOfUsers: this.noOfUsers,
        discount: this.discount,
        currencyId: this.currencyId,
        maxAmount: this.maxDiscountAmount,
        minBuyAmount: this.minimumBuyAmount,
        startDate: this.sDate,
        endtDate: this.eDate,
      };

      if (this.isEdit) {

        coupon.couponId = this.couponId;
        coupon.status = this.status;

        this.serviceCoupon.updateCoupon(coupon).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.couponList[this.editIndex] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceCoupon.addCoupon(coupon).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.couponList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();
          });
      }
    }
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete coupon?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceCoupon.deleteCoupon(this.couponList[index].id).subscribe((res: ServerResponse) => {
        
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.couponList.splice(index, 1);
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
}
