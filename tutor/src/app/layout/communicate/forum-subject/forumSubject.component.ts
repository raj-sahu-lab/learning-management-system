import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-forumSubject',
  providers: [ForumApiHelper],
  templateUrl: './forumSubject.component.html',
  styleUrls: ['./forumSubject.component.scss']
})
export class ForumSubjectComponent implements OnInit {

  filter = false;
  selectedDescription: any;
  forumList = [];

  forumSubject = [];
  isEdit = false;
  forumSubjectId = null;

  categoryId = undefined;
  title = '';
  description = '';
  status = '0';

  columCategory = false;
  columSubject = true;
  columDescription = true;
  columStatus = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router, protected serviceForum: ForumApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.forum();
    this.forumSubjectList();
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  forum() {
    this.serviceForum.getForumList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.forumList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  forumSubjectList() {

    this.serviceForum.getForumSubjectList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.forumSubject = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  cancelEditClick() {

    this.isEdit = false;
    this.forumSubjectId = null;

    this.categoryId = undefined;
    this.title = '';
    this.description = '';
    this.status = '0';

  }

  editButtonClick(forumSubjectId) {

    const subject = this.forumSubject.find(obj => obj.id == forumSubjectId);
    this.isEdit = true;
    this.forumSubjectId = forumSubjectId;

    this.categoryId = subject.category.id;
    this.title = subject.title;
    this.description = subject.description;
    this.status = subject.status ? subject.status.toString() : '0';
  }

  deleteButtonClick(forumSubjectId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete forum subject?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceForum.deleteForumSubject(forumSubjectId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.forumSubject.splice(this.forumSubject.findIndex(obj => obj.id == forumSubjectId), 1);
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

  submitButtonClick() {

    if (this.categoryId == undefined) {

      this.snotify.body = 'Please select forum category.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter forum subject title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter forum subject description.';
      this.snotify.onError();

    } else {

      const forumData: {[k: string]: any} = {

        categoryId: this.categoryId,
        title: this.title,
        description: this.description

      };

      if (this.isEdit) {

        forumData.forumSubjectId = this.forumSubjectId;
        forumData.status = this.status;

        this.serviceForum.updateForumSubject(forumData).subscribe((res: ServerResponse) => {
          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumSubject[this.forumSubject.findIndex(obj => obj.id == this.forumSubjectId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceForum.addForumSubject(forumData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumSubject.unshift(res.data);
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

  showDescription(forumSubjectId) {

    this.selectedDescription = this.forumSubject.find(obj => obj.id == forumSubjectId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
