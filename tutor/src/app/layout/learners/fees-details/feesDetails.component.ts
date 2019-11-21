import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { FeesApiHelper } from '../../../RestApiCall/ApiHelper/Fees.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-feesDetails',
  providers: [FeesApiHelper],
  templateUrl: './feesDetails.component.html',
  styleUrls: ['./feesDetails.component.scss']
})
export class FeesDetailsComponent implements OnInit {

  filter = false;
  purchaseList = [];
  selectedPreview: any;
  
  columStudent = true;
  columType = true;
  columCourse = true;
  columAmount = true;
  columPaidBy = true;
  columDate = true;
  columValidity = true;

  loggedIn : any;
  public userType: number;

  constructor(public router: Router, public httpURL: HttpClient, protected serviceFees: FeesApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if (this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceFees.getpurchaseList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.purchaseList = res.data;
        
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
