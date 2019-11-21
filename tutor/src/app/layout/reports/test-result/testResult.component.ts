import { Component, OnInit } from '@angular/core';
import { TestresultApiHelper } from '../../../RestApiCall/ApiHelper/Testresult.service';
import { HttpClient } from '@angular/common/http';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
declare var $: any;

@Component({
  selector: 'app-testResult',
  providers: [TestresultApiHelper],
  templateUrl: './testResult.component.html',
  styleUrls: ['./testResult.component.scss']
})

export class TestResultComponent implements OnInit {

  filter = false;
  testresultList = [];

  columStudent = true;
  columTest = true;
  columQuestion = true;
  columDuration = true;
  columMark = true;
  columAttempt = true;
  columCorrect = true;
  columScore = true;

  constructor(public httpURL: HttpClient, protected serviceTestresult: TestresultApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceTestresult.getTestresultList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.testresultList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

}
