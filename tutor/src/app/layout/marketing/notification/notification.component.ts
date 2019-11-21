import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { NgxImageCompressService} from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { FeesApiHelper } from '../../../RestApiCall/ApiHelper/Fees.service';
import { NotificationApiHelper } from '../../../RestApiCall/ApiHelper/notification.service';

@Component({
  selector: 'app-notification',
  providers: [BranchApiHelper, LearnerApiHelper, FeesApiHelper,NotificationApiHelper],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  filter: boolean = false;
  
  notificationList = [];

  learnerList = [];
  typesList = [];
  courseList = [];

  type: undefined;
  course: undefined;
  amount = '';

  branchList = [];
  branchId = undefined;

  studentId = [];

  notificationType:undefined;
  title = '';
  content = '';

  image = '';
  selectedNotificationImage: any;
  selectedNotificationFile: any;

  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  columTitle = true;
  columDescription = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router,  protected serviceBranch: BranchApiHelper, protected serviceLearner: LearnerApiHelper, protected serviceFees: FeesApiHelper, protected serviceNotification: NotificationApiHelper, private imageCompress: NgxImageCompressService, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    if(this.userType != 1) {
      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceBranch.getBranchList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.branchList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  typeList() {

    //this.cancelEditClick();

    this.serviceFees.getTypesList(this.branchId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        res.data.forEach(type => {

          if (type.list.length !== 0) {
            this.typesList.push(type);
          }

        });

      }
    },
      (err) => {

        console.log(err);
      });
  }

  typeChanged() {

    this.course = undefined;
    this.amount = '';

    this.typesList.forEach(types => {

      if (this.type == types.type) {
        this.courseList = types.list;
      }
    });
  }

  learnerListGet() {

    this.serviceLearner.getLearnerListUnpaid('4', this.type, this.course).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.learnerList = res.data;
        this.learnerList.forEach(learner => {
          learner.selected = false;
        });
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });

  }

  notificationFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      this.selectedNotificationFile = fileInput.target.files[0];
      
      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {

        this.selectedNotificationImage = e.target['result'];
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  cancelEditClick() {

    this.notificationType = undefined;
    this.image = '';
    this.title = '';
    this.content = '';

    this.branchId = undefined;
    this.type = undefined;
    this.course = undefined;
    this.studentId = [];

    this.courseList = [];
    this.learnerList = [];
    this.typesList = [];

    this.selectedNotificationImage = null;
    this.selectedNotificationFile = null;
  }

  studentCheck(learnerId, event) {

    if (event.target.checked) {

      this.studentId.push(learnerId);
    }

    if (!event.target.checked) {

      const index = this.studentId.indexOf(learnerId);

      if (index > -1) {

        this.studentId.splice(index, 1);
      }
    }

  }

  selectAll(event) {
    this.studentId = [];
    for (let i = 0; i < this.learnerList.length; i++) {


      if (event.target.checked) {

        this.studentId.push(this.learnerList[i].id);
        this.learnerList[i].selected = true;

      } else {

        this.studentId = [];
        this.learnerList[i].selected = false;

      }
    }

  }

  submitButtonClick() {

    if (this.notificationType == undefined) {

      this.snotify.body = 'Please select notification type.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter title.';
      this.snotify.onError();

    } else if (this.content == '') {

      this.snotify.body = 'Please enter content.';
      this.snotify.onError();

    } else if (this.notificationType ==2 && this.branchId == undefined) {

      this.snotify.body = 'Please select branch.';
      this.snotify.onError();

    } else if (this.notificationType ==2 && this.type == undefined) {

      this.snotify.body = 'Please select course type.';
      this.snotify.onError();

    } else if (this.notificationType ==2 && this.course == undefined) {

      this.snotify.body = 'Please select course.';
      this.snotify.onError();

    } else if (this.notificationType ==2 && this.studentId.length == 0) {

      this.snotify.body = 'Please select Students.';
      this.snotify.onError();

    } else {

      const notificationData: { [k: string]: any } = {

        notificationType: this.notificationType,
        title: this.title,
        content: this.content,
      };

      if (this.notificationType == 2) {

        notificationData.type = this.type,
        notificationData.id = this.course,
        notificationData.studentId = this.studentId.toString()
      }
      
      this.serviceNotification.sendNotification(this.selectedNotificationFile,notificationData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.branchId = undefined;

        this.cancelEditClick();

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();
        });

    }
  }

}
