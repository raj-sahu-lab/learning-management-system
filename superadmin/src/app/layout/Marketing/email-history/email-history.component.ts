import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { EmailHistoryApiHelper } from '../../../RestApiCall/ApiHelper/email-history.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-email-history',
  providers: [EmailHistoryApiHelper],
  templateUrl: './email-history.component.html',
  styleUrls: ['./email-history.component.scss']
})
export class EmailHistoryComponent implements OnInit {

  emailHistoryList = [];
  constructor(protected serviceEmailHistory: EmailHistoryApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceEmailHistory.getEmailHistoryList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        this.emailHistoryList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

}
