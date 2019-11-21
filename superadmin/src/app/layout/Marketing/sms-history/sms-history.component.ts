import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { SmsHistoryApiHelper } from '../../../RestApiCall/ApiHelper/sms-history.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-sms-history',
  providers: [SmsHistoryApiHelper],
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.scss']
})
export class SmsHistoryComponent implements OnInit {

  smsHistoryList = [];
  constructor(protected serviceSmsHistory: SmsHistoryApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceSmsHistory.getSmsHistoryList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        this.smsHistoryList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

}
