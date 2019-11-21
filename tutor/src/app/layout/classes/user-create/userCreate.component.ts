import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { StudentClassApiHelper } from '../../../RestApiCall/ApiHelper/student-class.service';
import { TutorApiHelper } from '../../../RestApiCall/ApiHelper/Tutor.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
@Component({
  selector: 'app-userCreate',
  providers: [StudentClassApiHelper, TutorApiHelper],
  templateUrl: './userCreate.component.html',
  styleUrls: ['./userCreate.component.scss']
})
export class UserCreateComponent implements OnInit {

  blueJeansLiveClassUserList = [];
  blueJeansLiveClassUserListId = null;

  zoomLiveClassUserList = [];
  zoomLiveClassUserListId = null;

  liveClassLimit: number;
  liveClassUserList = [];

  tutorList = [];
  tutorId = undefined;
  liveClassCompany = undefined;

  public userType = undefined;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper, public router: Router, protected serviceStudentClass: StudentClassApiHelper, protected serviceTutor: TutorApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;

      if (this.userType != 1) {

        // Institute Login
        this.router.navigate(['/not-found']);
      }

      if (this.userPurchasePlan == 5 || this.userPurchasePlan == 3) {

        this.liveClassLimit = 3;
      }
      else {

        this.liveClassLimit = 1;

      }

      this.blueJeansUserListGet();
      this.zoomUserListGet();
      
    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }
  }

  blueJeansUserListGet() {

    this.serviceStudentClass.getBlueJeansUserClassList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.blueJeansLiveClassUserList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  zoomUserListGet() {

    this.serviceStudentClass.getZoomUserClassList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.zoomLiveClassUserList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  userChanged() {

    if (this.liveClassCompany == 1) {
      this.liveClassUserList = this.blueJeansLiveClassUserList;

    } else {

      this.liveClassUserList = this.zoomLiveClassUserList;

    }

    this.serviceTutor.getTutorList('0').subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.tutorList = res.data;

        this.tutorList.forEach((tutor, index) => {

          this.liveClassUserList.forEach(user => {

            if (tutor.id == user.tutor.id) {
              this.tutorList.splice(index, 1);
            }

          });

        });
      }
    },
      (err) => {

        console.log(err);
      });
  }

  submitButtonClick() {

    if (this.liveClassLimit == (this.blueJeansLiveClassUserList.length + this.zoomLiveClassUserList.length)) {

      this.snotify.body = 'Sorry, You can not create more users.';
      this.snotify.onError();

    } else if (this.liveClassCompany == undefined) {

      this.snotify.body = 'Please select user type.';
      this.snotify.onError();

    } else if (this.tutorId == undefined) {

      this.snotify.body = 'Please select educator.';
      this.snotify.onError();

    } else {

      let createUserData: { [k: string]: any } = {

        tutorId: this.tutorId
      };

      if (this.liveClassCompany == 1) {

        this.serviceStudentClass.addBlueJeansUser(createUserData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.blueJeansLiveClassUserList.unshift(res.data);
          }
        },
          (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceStudentClass.addZoomUser(createUserData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.zoomLiveClassUserList.unshift(res.data);
          }
        },
          (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();

          });

      }

      this.liveClassCompany = undefined;
      this.tutorList = [];
      this.tutorId = undefined;

    }

  }

}
