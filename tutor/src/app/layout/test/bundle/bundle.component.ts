import { Component, OnInit } from '@angular/core';
import { SetApiHelper } from '../../../RestApiCall/ApiHelper/Set.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { BundleService } from '../../../RestApiCall/ApiHelper/bundle.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss']
})
export class BundleComponent implements OnInit {

  bundleList: any = [];
  setLists: any = [];
  editBundle: any;

  currencyList = [];
  currencyId = undefined;

  title = '';
  page = 1;
  setPage = 1;
  limit = 10;
  selectedSet: any = [];
  bundleSelected: any;

  paymentTypeFree = '0';

  paymentGateWayId = null;
  iosPaymentGateWayid = null;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(protected serviceCurrency: CurrencyApiHelper,protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSet: SetApiHelper, public snotify: TostNotificationService, public bundleService: BundleService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    this.currencyId = User.currency_id;
    
    this.getSet(this.setPage, this.limit);
    this.getBundle(this.page, this.limit);
    this.getPaymentGatewayInfo();

    this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.currencyList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  getBundle(page, limit) {
    this.page = page;
    this.bundleService.getBundleList(page, limit).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        if (this.bundleList) {
          res.data.forEach(set => {
            this.bundleList.push(set);
          });
        } else {
          this.bundleList = res.data;
        }
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  getSet(page, limit) {

    this.setPage = page;
    this.serviceSet.getSetList(page, limit).subscribe((res: ServerResponse) => {
      if (res != null && res.success && res.data != null) {
        if (this.setLists) {
          res.data.forEach(series => {
            this.setLists.push(series);
          });
        } else {
          this.setLists = res.data;
        }
      }
    },
      (err) => {
        console.log(err);
      });
  }

  getPaymentGatewayInfo() {
    this.servicePaymentGateWay.getPaymentGateWayList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.paymentGateWayList = res.data.gateWay;
        this.iOSInAppList = res.data.iOSInApp;

      }
    },
      (err) => {

        console.log(err);
      });
  }

  selectAll(event) {

    this.selectedSet = [];

    this.setLists.forEach(set => {

      const srs = document.getElementById('set' + set.id) as HTMLInputElement;

      if (event.target.checked) {
        srs.checked = true;
        this.selectedSet.push(set.id);
      } else {
        this.selectedSet = [];
        srs.checked = false;
      }

    });

  }

  setChecked(id, event) {
    if (event.target.checked) {
      this.selectedSet.push(id);
    }

    if (!event.target.checked) {
      const index = this.selectedSet.indexOf(id);
      if (index > -1) {
        this.selectedSet.splice(index, 1);
      }
    }

  }

  editSetChecked(id, event) {
    if (event.target.checked) {
      this.selectedSet.push(id);
    }

    if (!event.target.checked) {
      const index = this.selectedSet.indexOf(id);
      if (index > -1) {
        this.selectedSet.splice(index, 1);
      }
    }

  }

  hideEditModal() {
    this.selectedSet = [];
    this.setLists.forEach(set => {
      const srs = document.getElementById('editSet' + set.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.editBundle = null;
  }

  deleteBundleButtonClick(id: any) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this Bundle?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.bundleService.deleteBundle(id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.bundleList.splice(this.bundleList.findIndex(obj => obj.id == id), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  showSetList(bundle) {
    this.bundleSelected = bundle;
  }

  deleteSetButtonClick(id: any) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this set from Bundle?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.bundleService.removeSetFromBundle(id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.bundleSelected.setList.splice(this.bundleSelected.setList.findIndex(obj => obj.id == id), 1);
        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }
  hideDeleteModal() {
    this.bundleSelected = null;
  }

  editButtonClick(bundleList) {
    this.editBundle = bundleList;
    this.selectedSet = [];
    this.setLists.forEach(set => {
      const srs = document.getElementById('set' + set.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.title = undefined;
    this.page = 1;
    this.setPage = 1;
  }

  cancelEditClick() {

    this.title = '';
    this.selectedSet = [];
    const selAll = document.getElementById('selectAll') as HTMLInputElement;
    if (selAll) {
      selAll.checked = false;
    }
    this.setLists.forEach(set => {
      const srs = document.getElementById('set' + set.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.page = 1;
    this.setPage = 1;
    this.paymentTypeFree = '0';
    this.paymentGateWayId = null;
    this.iosPaymentGateWayid = null;
    this.currencyId = this.loggedIn.user.currency_id;
    this.amount = 0;
    this.validity = 0;
    this.previewText = '';
  }

  submitButtonClick() {

    if (this.title == '') {
      this.snotify.body = 'Please Enter Title.';
      this.snotify.onError();

    } else if (this.paymentGateWayId == null && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please select payment gateway.';
      this.snotify.onError();

    } else if (this.iosPaymentGateWayid == null && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please select iOS payment.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else if ((this.amount == null || this.amount == 0) && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please enter amount.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && (this.validity == null || this.validity == 0)) {

      this.snotify.body = 'Please enter validity.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.validity >= 365) {

      this.snotify.body = 'Please enter validity less than 365 days.';
      this.snotify.onError();

    } else if (this.previewText == '' && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please enter preview.';
      this.snotify.onError();

    } else if (!this.selectedSet.length) {
      this.snotify.body = 'Please Select Set';
      this.snotify.onError();

    } else {

      const bundleData: {[k: string]: any} = {
        title: this.title,
        selectedSet: this.selectedSet,

        isPaid: this.paymentTypeFree

      };

      if (this.paymentTypeFree == '1') {
        bundleData.paymentGateWayId = this.paymentGateWayId;
        bundleData.iosPaymentGateWayid = this.iosPaymentGateWayid;
        bundleData.currencyId = this.paymentTypeFree == '1' ? this.currencyId : null,
        bundleData.amount = this.amount;
        bundleData.validity = this.validity;
        bundleData.preview = this.previewText;
      }

      this.bundleService.addBundle(bundleData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {
          this.bundleList.unshift(res.data);
          this.helperService.loadDataTable();
          this.setLists.forEach(set => {
            const srs = document.getElementById('set' + set.id) as HTMLInputElement;
            srs.checked = false;
          });
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

  updateSubmitButtonClick() {
    if (this.selectedSet.length <= 0) {
      this.snotify.body = 'Please Select Set';
      this.snotify.onError();
    } else {
      const data = {
        bundleId : this.editBundle.id,
        selectedSet : this.selectedSet
      };
      this.bundleService.addSetToBundle(data).subscribe((res: ServerResponse) => {

        if (res != null && res.success && res.data) {
          const index = this.bundleList.findIndex(obj => obj.id == this.editBundle.id);
          if (index >= 0) {
            this.bundleList[index] = res.data;
            this.helperService.loadDataTable();
          }
          this.hideEditModal();
        }
      },
        (err) => {
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }
  }
}