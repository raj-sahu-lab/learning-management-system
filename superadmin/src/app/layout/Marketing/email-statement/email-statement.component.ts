import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { EmailStatementApiHelper } from '../../../RestApiCall/ApiHelper/email-statement.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-email-statement',
  providers: [EmailStatementApiHelper],
  templateUrl: './email-statement.component.html',
  styleUrls: ['./email-statement.component.scss']
})
export class EmailStatementComponent implements OnInit {

  emailStatementList = [];
  instituteId = '';
  constructor(private route: ActivatedRoute, protected serviceEmailStatement: EmailStatementApiHelper, public snotify: TostNotificationService, public helperService: HelperService) {
    this.instituteId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.serviceEmailStatement.getEmailStatementList(this.instituteId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.emailStatementList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

}
