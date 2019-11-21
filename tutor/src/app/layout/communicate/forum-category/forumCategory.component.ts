import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-forumCategory',
  providers: [ForumApiHelper],
  templateUrl: './forumCategory.component.html',
  styleUrls: ['./forumCategory.component.scss']
})
export class ForumCategoryComponent implements OnInit {

  forumCategory = [];
  isEdit = false;
  forumCategoryId = null;

  title = '';
  status = '0';

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router,protected serviceForum: ForumApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.forumCategoryList();
  }

  forumCategoryList() {
    this.serviceForum.getForumCategoryList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.forumCategory = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  cancelEditClick() {

    this.isEdit = false;
    this.forumCategoryId = null;

    this.title = '';
    this.status = '0';

  }

  editButtonClick(forumCategoryId) {

    const category = this.forumCategory.find(obj => obj.id == forumCategoryId);

    this.isEdit = true;
    this.forumCategoryId = forumCategoryId;

    this.title = category.title;
    this.status = category.status ? category.status.toString() : '0';
  }

  deleteButtonClick(forumCategoryId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete forum category?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceForum.deleteForumCategory(forumCategoryId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.forumCategory.splice(this.forumCategory.findIndex(obj => obj.id == forumCategoryId), 1);
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

    if (this.title == '') {

      this.snotify.body = 'Please enter forum category title.';
      this.snotify.onError();

    } else {

      const forumData: {[k: string]: any} = {

        title: this.title
      };

      if (this.isEdit) {
        forumData.forumCategoryId = this.forumCategoryId;
        forumData.status = this.status;

        this.serviceForum.updateForumCategory(forumData).subscribe((res: ServerResponse) => {
          this.snotify.body = res.message;
          this.snotify.onSuccess();


          if (res.success && res.data != null) {

            this.forumCategory[this.forumCategory.findIndex(obj => obj.id == this.forumCategoryId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceForum.addForumCategory(forumData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.forumCategory.unshift(res.data);
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
