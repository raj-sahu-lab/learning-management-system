import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { BundleService } from '../../../RestApiCall/ApiHelper/bundle.service';
@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit {

  bundleCount = 0;
  questionCount = 0;
  seriesCount = 0;
  setCount = 0;

  constructor(public snotify: TostNotificationService, public bundleService: BundleService) { }

  ngOnInit() {

    this.bundleService.getBundleCount().subscribe((res: ServerResponse) => {
      if (res != null && res.success && res.data != null) {

        this.bundleCount = res.data.bundleCount;
        this.questionCount = res.data.questionCount;
        this.seriesCount = res.data.seriesCount;
        this.setCount = res.data.setCount;

      }
    },
      (err) => {

        console.log(err);
      });

  }

}
