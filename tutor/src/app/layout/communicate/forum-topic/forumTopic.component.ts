import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-forumTopic',
  providers: [ForumApiHelper],
  templateUrl: './forumTopic.component.html',
  styleUrls: ['./forumTopic.component.scss']
})
export class ForumTopicComponent implements OnInit {

  filter = false;
  selectedDescription: any;
  forumList = [];

  subjectList = [];

  forumTopic = [];
  isEdit = false;
  forumTopicId = null;

  categoryId = undefined;
  subjectId = undefined;
  title = '';
  description = '';
  status = '0';

  columCategory = false;
  columSubject = false;
  columTopic = true;
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
    this.forumTopicList();
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

  categoryChanged() {

    this.subjectId = undefined;
    this.forumList.forEach(category => {

        if (this.categoryId == category.id) {
          this.subjectList = category.subjects;
        }
    });
  }

  forumTopicList() {

    this.serviceForum.getForumTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.forumTopic = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  cancelEditClick() {

    this.isEdit = false;
    this.forumTopicId = null;

    this.categoryId = undefined;
    this.subjectId = undefined;
    this.title = '';
    this.description = '';
    this.status = '0';

  }

  editButtonClick(forumTopicId) {

    const topic = this.forumTopic.find(obj => obj.id == forumTopicId);

    this.isEdit = true;
    this.forumTopicId = topic.id;

    this.categoryId = topic.subject.category.id;
    this.categoryChanged();

    this.subjectId = topic.subject.id;
    this.title = topic.title;
    this.description = topic.description;
    this.status = topic.status ? topic.status.toString() : '0';
  }

  deleteButtonClick(forumTopicId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete forum topic?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceForum.deleteForumTopic(forumTopicId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.forumTopic.splice(this.forumTopic.findIndex(obj => obj.id == forumTopicId), 1);
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

    } else if (this.subjectId == undefined) {

      this.snotify.body = 'Please select forum subject.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter forum topic title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter forum topic description.';
      this.snotify.onError();

    } else {

      const forumData: {[k: string]: any} = {

        categoryId: this.categoryId,
        subjectId: this.subjectId,
        title: this.title,
        description: this.description

      };

      if (this.isEdit) {

        forumData.forumTopicId = this.forumTopicId;
        forumData.status = this.status;

        this.serviceForum.updateForumTopic(forumData).subscribe((res: ServerResponse) => {
          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumTopic[this.forumTopic.findIndex(obj => obj.id == this.forumTopicId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceForum.addForumTopic(forumData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumTopic.unshift(res.data);
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

  showDescription(forumTopicId) {

    this.selectedDescription = this.forumTopic.find(obj => obj.id == forumTopicId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
