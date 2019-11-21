import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { NgxImageCompressService} from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import { NotificationApiHelper } from '../../../RestApiCall/ApiHelper/notification.service';

@Component({
  selector: 'app-notifications',
  providers: [NotificationApiHelper],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificationList = [];

  constructor(public router: Router, protected serviceNotification: NotificationApiHelper, private imageCompress: NgxImageCompressService, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceNotification.getNotificationList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.notificationList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

}
