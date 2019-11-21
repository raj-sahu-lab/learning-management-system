import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';
import { CurrenyApiHelper } from '../../RestApiCall/ApiHelper/curreny.service';
declare var $: any;
import { HelperService } from '../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-curreny',
  providers: [CurrenyApiHelper],
  templateUrl: './curreny.component.html',
  styleUrls: ['./curreny.component.scss']
})
export class CurrenyComponent implements OnInit {

  currencyList = [];
  isEdit = false;
  currencyId = null;

  title = '';
  sign = '';
  code = '';
  status = '0';

  constructor(public httpURL: HttpClient, protected serviceCurreny: CurrenyApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceCurreny.getCurrencyList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.currencyList = res.data;
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });
  }

  deleteButtonClick(currencyId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete curreny?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceCurreny.deleteCurrency(currencyId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.currencyList.splice(this.currencyList.findIndex(obj => obj.id === currencyId), 1);
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

  editButtonClick(currencyId) {

    const curreny = this.currencyList.find(obj => obj.id === currencyId);
    this.isEdit = true;
    this.currencyId = currencyId;

    this.title = curreny.title;
    this.sign = curreny.sign;
    this.code = curreny.code;
    this.status = curreny.status ? curreny.status.toString() : '0';

    document.getElementById('startForm').scrollIntoView();
  }

  cancelEditClick() {

    this.isEdit = false;
    this.currencyId = null;

    this.title = '';
    this.sign = '';
    this.code = '';
  }

  submitButtonClick() {

    if (this.title === '') {

      this.snotify.body = 'Please enter curreny title.';
      this.snotify.onError();

    } else  if (this.sign === '') {

      this.snotify.body = 'Please enter curreny sign.';
      this.snotify.onError();

    } else if (this.code === '') {

      this.snotify.body = 'Please enter curreny code.';
      this.snotify.onError();

    } else {

      const currencyData: { [k: string]: any } = {

        title: this.title,
        sign: this.sign,
        code: this.code,
      };

      if (this.isEdit) {

        currencyData.currencyId = this.currencyId;
        currencyData.status = this.status;

        this.serviceCurreny.updateCurrency(currencyData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.currencyList[this.currencyList.findIndex(obj => obj.id === this.currencyId)] = res.data;
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

        this.serviceCurreny.addCurrency(currencyData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.currencyList.unshift(res.data);
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
