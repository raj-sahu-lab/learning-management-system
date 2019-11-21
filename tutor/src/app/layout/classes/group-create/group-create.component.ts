import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { StudentClassApiHelper } from '../../../RestApiCall/ApiHelper/student-class.service';
declare var $: any;
import { NgxImageCompressService } from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import * as moment from 'moment-timezone';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {

  learnerList = [];

  groupList = [];
  group_id = null;

  title = '';
  studentId = [];
  editStudentId = [];
  deleteStudentId = [];
  public userType: number;
  isCustomDatePicker: Boolean = false;

  selectedPreview: any;
  selectedDescription: any;

  constructor(private authApiHelper: AuthApiHelper, public router: Router, protected serviceLearner: LearnerApiHelper, protected serviceStudentClass: StudentClassApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  ngOnInit() {
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;

      this.lernerListGet();
      this.groupListGet();

    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }
  }

  lernerListGet() {
    this.serviceLearner.getLearnerList('0').subscribe((res: ServerResponse) => {

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

  groupListGet() {

    this.serviceStudentClass.getGroupList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.groupList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
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

  cancelEditClick() {

    this.title = '';
    this.lernerListGet();
    this.studentId = [];

    const student = document.getElementById('selectAll') as HTMLInputElement;
    student.checked = false;
  }

  submitButtonClick() {
    
    if (this.title == '') {

      this.snotify.body = 'Please enter group title.';
      this.snotify.onError();

    } else if (this.studentId.length == 0) {

      this.snotify.body = 'Please select Students.';
      this.snotify.onError();

    } else {

      const groupData: { [k: string]: any } = {

        group_name: this.title,
        student_ids: this.studentId,
      };

      this.serviceStudentClass.addGroup(groupData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {

          location.reload();

        }
      },
        (err) => {

          console.log(err);

          this.snotify.body = err.error;
          this.snotify.onError();

        });


    }

  }

  deleteStudentCheck(deleteStudentId, event) {

    if (event.target.checked) {

      this.deleteStudentId.push(deleteStudentId);
    }

    if (!event.target.checked) {

      const index = this.deleteStudentId.indexOf(deleteStudentId);

      if (index > -1) {

        this.deleteStudentId.splice(index, 1);
      }
    }
  }

  deleteButtonClick() {

    const groupData: { [k: string]: any } = {

      group_id: this.group_id,
      student_ids: this.deleteStudentId
    };

    this.serviceStudentClass.deleteStudentFromGroup(groupData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();
      
      location.reload();
    },
      (err) => {

        console.log(err);

        this.snotify.body = err.error;
        this.snotify.onError();

      });
    
  }

  editStudentCheck(learnerId, event) {

    if (event.target.checked) {

      this.editStudentId.push(learnerId);
    }

    if (!event.target.checked) {

      const index = this.editStudentId.indexOf(learnerId);

      if (index > -1) {

        this.editStudentId.splice(index, 1);
      }
    }
  }

  editButtonClick() {

   if (this.editStudentId.length == 0) {

      this.snotify.body = 'Please select Students.';
      this.snotify.onError();

    } else {

      const groupData: { [k: string]: any } = {

        group_id: this.group_id,
        student_ids: this.editStudentId
      };


      this.serviceStudentClass.addGroupStudent(groupData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        location.reload();
      },
        (err) => {

          console.log(err);

          this.snotify.body = err.error;
          this.snotify.onError();

        });


    }

  }

  showPreview(index) {

    this.group_id = this.groupList[index].group_id;
    this.selectedPreview = this.groupList[index].group;
  }

  hidePreview() {

    this.selectedPreview = null;
    this.deleteStudentId = [];
    this.groupListGet();
  }

  showDescription(index) {

    this.group_id = this.groupList[index].group_id;
    this.selectedDescription = this.learnerList;
    this.groupListGet();
  }

  hideDescription() {

    this.selectedDescription = null;
    this.groupListGet();
  }

}
