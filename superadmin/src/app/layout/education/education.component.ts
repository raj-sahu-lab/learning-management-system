import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';
import { EducationApiHelper } from '../../RestApiCall/ApiHelper/education.service';
declare var $: any;
import { HelperService } from '../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-education',
  providers: [EducationApiHelper],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  educationList = [];
  isEdit = false;
  educationId = null;

  title = '';
  status = '0';

  constructor(public httpURL: HttpClient, protected serviceEducation: EducationApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceEducation.getEducationList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.educationList = res.data;
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });
  }

  deleteButtonClick(educationId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete education?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceEducation.deleteEducation(educationId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.educationList.splice(this.educationList.findIndex(obj => obj.id === educationId), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  editButtonClick(educationId) {
    
    const education = this.educationList.find(obj => obj.id === educationId);
    this.isEdit = true;
    this.educationId = educationId;

    this.title = education.title;
    this.status = education.status ? education.status.toString() : '0';

    document.getElementById('startForm').scrollIntoView();

  }

  cancelEditClick() {

    this.isEdit = false;
    this.educationId = null;

    this.title = '';
  }

  submitButtonClick() {

    if (this.title === '') {

      this.snotify.body = 'Please enter education title.';
      this.snotify.onError();

    } else {

      const educationData: { [k: string]: any } = {

        title: this.title,
      };

      if (this.isEdit) {

        educationData.educationId = this.educationId;
        educationData.status = this.status;

        this.serviceEducation.updateEducation(educationData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.educationList[this.educationList.findIndex(obj => obj.id === this.educationId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.serviceEducation.addEducation(educationData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.educationList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      }
    }
  }

}
