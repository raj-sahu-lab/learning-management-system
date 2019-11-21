import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { SmsStatementApiHelper } from '../../../RestApiCall/ApiHelper/sms-statement.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-sms-statement',
  providers: [SmsStatementApiHelper],
  templateUrl: './sms-statement.component.html',
  styleUrls: ['./sms-statement.component.scss']
})
export class SmsStatementComponent implements OnInit {

  smsStatementList = [];
  instituteId = '';
  constructor(private route: ActivatedRoute, protected serviceSmsStatement: SmsStatementApiHelper, public snotify: TostNotificationService, public helperService: HelperService) {
    this.instituteId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.serviceSmsStatement.getSmsStatementList(this.instituteId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.smsStatementList = res.data;
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });

  }

}
