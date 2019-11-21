import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { TutorApiHelper } from '../../../RestApiCall/ApiHelper/Tutor.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-forumArticles',
  providers: [ForumApiHelper, TutorApiHelper],
  templateUrl: './forumArticles.component.html',
  styleUrls: ['./forumArticles.component.scss']
})
export class ForumArticlesComponent implements OnInit {

  filter = false;
  selectedDescription: any;
  forumList = [];
  subjectList = [];
  topicList = [];
  tutorList = [];

  forumArticles = [];
  isEdit = false;
  forumArticlesId = null;

  tutorId = undefined;
  categoryId = undefined;
  subjectId = undefined;
  topicId = undefined;
  title = '';
  description = '';
  status = '0';

  columAuthor = false;
  columCategory = false;
  columSubject = false;
  columTopic = true;
  columArticle = true;
  columDescription = true;
  columStatus = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router, protected serviceForum: ForumApiHelper, protected serviceTutor: TutorApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

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
    this.tutor();
    this.forumArticlesList();

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

    this.subjectChanged();
    this.subjectId = undefined;

    this.topicList = [];
    this.topicId = undefined;

    this.forumList.forEach(category => {

        if (this.categoryId == category.id) {
          this.subjectList = category.subjects;
        }
    });
  }

  subjectChanged() {

    this.topicId = undefined;
    this.subjectList.forEach(subject => {

      if (this.subjectId == subject.id) {

        this.topicList = subject.topics;
      }

    });
  }

  tutor() {

    this.serviceTutor.getTutorList('0').subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.tutorList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  forumArticlesList() {

    this.serviceForum.getForumArticlesList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.forumArticles = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  cancelEditClick() {

    this.isEdit = false;
    this.forumArticlesId = null;

    this.tutorId = undefined;
    this.categoryId = undefined;
    this.subjectId = undefined;
    this.topicId = undefined;
    this.title = '';
    this.description = '';
    this.status = '0';

  }

  editButtonClick(forumArticlesId) {

    const articles = this.forumArticles.find(obj => obj.id == forumArticlesId);
    this.isEdit = true;
    this.forumArticlesId = forumArticlesId;

    this.tutorId = articles.author.id;
    this.categoryId = articles.topic.subject.category.id;
    this.categoryChanged();

    this.subjectId = articles.topic.subject.id;
    this.subjectChanged();

    this.topicId = articles.topic.id;
    this.title = articles.title;
    this.description = articles.description;
    this.status = articles.status ? articles.status.toString() : '0';
  }

  deleteButtonClick(forumArticlesId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete forum articles?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceForum.deleteForumArticles(forumArticlesId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.forumArticles.splice(this.forumArticles.findIndex(obj => obj.id == forumArticlesId), 1);
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

    if (this.tutorId == undefined) {

      this.snotify.body = 'Please select articles author.';
      this.snotify.onError();

    } else if (this.categoryId == undefined) {

      this.snotify.body = 'Please select forum category.';
      this.snotify.onError();

    } else if (this.subjectId == undefined) {

      this.snotify.body = 'Please select forum subject.';
      this.snotify.onError();

    } else if (this.topicId == undefined) {

      this.snotify.body = 'Please select forum topic.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter forum articles title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter forum articles description.';
      this.snotify.onError();

    } else {

      const forumData: {[k: string]: any} = {

        tutorId: this.tutorId,
        topicId: this.topicId,
        title: this.title,
        description: this.description

      };

      if (this.isEdit) {

        forumData.forumArticlesId = this.forumArticlesId;
        forumData.status = this.status;

        this.serviceForum.updateForumArticles(forumData).subscribe((res: ServerResponse) => {
          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumArticles[this.forumArticles.findIndex(obj => obj.id == this.forumArticlesId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceForum.addForumArticles(forumData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumArticles.unshift(res.data);
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

  showDescription(forumArticlesId) {

    this.selectedDescription = this.forumArticles.find(obj => obj.id == forumArticlesId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

  showArticleDiscussion(articleid) {

    this.router.navigate(['/forumDiscussion',articleid]);

  }
}
