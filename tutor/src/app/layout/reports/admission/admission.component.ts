import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-admission',
  providers: [LearnerApiHelper],
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit {

  filter = false;
  learnerList = [];

  columBranch = false;
  columFirstName = true;
  columLastName = true;
  columPhone = true;
  columEmail = true;

  loggedIn : any;
  public userType: number;

  constructor(public router: Router, protected serviceLearner: LearnerApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if (this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }


    this.serviceLearner.getLearnerList('0').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.learnerList = res.data;
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
