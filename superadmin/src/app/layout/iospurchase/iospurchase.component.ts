import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';
import { IospurchaseApiHelper } from '../../RestApiCall/ApiHelper/iospurchase.service';
import { HelperService } from '../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-iospurchase',
  templateUrl: './iospurchase.component.html',
  styleUrls: ['./iospurchase.component.scss']
})
export class IospurchaseComponent implements OnInit {

  iOSpurchaseList = [];
  isEdit = false;
  iOSpurchaseId = null;

  title = '';
  inAppId = '';
  inAppamount = 0;
  status = '0';

  constructor(public httpURL: HttpClient, protected serviceIospurchase: IospurchaseApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceIospurchase.getIospurchaseList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.iOSpurchaseList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }


  deleteButtonClick(iOSpurchaseId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete iOS price?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceIospurchase.deleteIospurchase(iOSpurchaseId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.iOSpurchaseList.splice(this.iOSpurchaseList.findIndex(obj => obj.id === iOSpurchaseId), 1);
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

  editButtonClick(educationId) {

    const iOSpurchase = this.iOSpurchaseList.find(obj => obj.id === educationId);
    this.isEdit = true;
    this.iOSpurchaseId = educationId;

    this.title = iOSpurchase.title;
    this.inAppId = iOSpurchase.inAppId;
    this.inAppamount = iOSpurchase.inAppamount;
    this.status = iOSpurchase.status ? iOSpurchase.status.toString() : '0';

    document.getElementById('startForm').scrollIntoView();
  }

  cancelEditClick() {

    this.isEdit = false;
    this.iOSpurchaseId = null;

    this.title = '';
    this.inAppId = '';
    this.inAppamount = 0;
  }

  submitButtonClick() {

    if (this.title === '') {

      this.snotify.body = 'Please enter title.';
      this.snotify.onError();

    } else if (this.inAppId === '') {

      this.snotify.body = 'Please enter App Id.';
      this.snotify.onError();

    } else if (this.inAppamount === 0) {

      this.snotify.body = 'Please enter App Amount.';
      this.snotify.onError();

    } else {

      const educationData: { [k: string]: any } = {

        title: this.title,
        inAppId: this.inAppId,
        inAppamount: this.inAppamount,
      };

      if (this.isEdit) {

        educationData.id = this.iOSpurchaseId;
        educationData.status = this.status;

        this.serviceIospurchase.updateIospurchase(educationData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.iOSpurchaseList[this.iOSpurchaseList.findIndex(obj => obj.id === this.iOSpurchaseId)] = res.data;
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

        this.serviceIospurchase.addIospurchase(educationData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.iOSpurchaseList.unshift(res.data);
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
