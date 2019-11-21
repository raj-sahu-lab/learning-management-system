import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { InstituteApiHelper } from '../../../RestApiCall/ApiHelper/institute.service';
import { NotificationApiHelper } from '../../../RestApiCall/ApiHelper/notification.service';

import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  filter: boolean = false;

  instituteList = [];
  instituteId = undefined;
  
  accountId = [];
  title = '';
  content = '';
  image = '';

  selectedNotificationImage: any;
  selectedNotificationFile: any;

  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  isMasterSel:boolean;

  constructor(public router: Router,protected serviceInstitute: InstituteApiHelper,protected serviceNotification: NotificationApiHelper, public helperService: HelperService, public snotify: TostNotificationService) {
    this.isMasterSel = false;
   }

  ngOnInit() {
    
    this.institutes();
  }

  institutes() {

    this.serviceInstitute.getInstituteList().subscribe((res: ServerResponse) => {

    if (res.success && res.data != null) {
      
      this.instituteList = res.data;
      this.helperService.loadDataTable();

    }
  },
    (err) => {

      console.log(err);
    });

}

  notificationFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      this.selectedNotificationFile = fileInput.target.files[0];

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {

        this.selectedNotificationImage = e.target['result'];
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  instituteCheck(accountId, event) {

    if (event.target.checked) {

      this.accountId.push(accountId);
    }

    if (!event.target.checked) {

      const index = this.accountId.indexOf(accountId);

      if (index > -1) {

        this.accountId.splice(index, 1);
      }
    }
  }

  selectAll(event) {

    for (let i = 0; i < this.instituteList.length; i++) {

      if (event.target.checked) {

        this.accountId.push(this.instituteList[i].account_id);
        this.instituteList[i].checked = true;

      } else {

        this.accountId = [];
        this.instituteList[i].checked = false;

      }
    }
  }

  submitButtonClick() {

    if (this.title == '') {

      this.snotify.body = 'Please select title.';
      this.snotify.onError();

    } else if (this.content == '') {

      this.snotify.body = 'Please select content.';
      this.snotify.onError();

    } else if (this.accountId.length == 0) {

      this.snotify.body = 'Please select institute.';
      this.snotify.onError();

    } else {

      const notificationData: { [k: string]: any } = {

        title: this.title,
        content: this.content,
        link: '',
        accountId: this.accountId.toString()
      };

      this.serviceNotification.sendNotification(this.selectedNotificationFile,notificationData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.cancelEditClick();

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();
        });

    }
  }

  cancelEditClick() {

    this.instituteList = [];
    this.institutes();
    this.helperService.loadDataTable();

    this.accountId = [];
    this.instituteId = undefined;
    this.image = '';
    this.selectedNotificationImage = null;
    this.selectedNotificationFile = null;

    this.title = '';
    this.content = '';

  }

}
