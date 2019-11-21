import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';

import { NewsCategoryApiHelper } from '../../../RestApiCall/ApiHelper/NewsCategory.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-news-category',
  providers: [NewsCategoryApiHelper],
  templateUrl: './news-category.component.html',
  styleUrls: ['./news-category.component.scss']
})

export class NewsCategoryComponent implements OnInit {

  filter = false;

  isEdit = false;
  newsCategoryList = [];
  newsCategoryId = null;
  editIndex = null;

  image = '';
  title = '';
  description = '';
  status = '0';

  selectedNewsCategoryImage: any;
  selectedNewsCategoryFile: any;

  columImage = true;
  columTitle = true;
  columDescription = true;
  columStatus = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router, protected serviceNewsCategory: NewsCategoryApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceNewsCategory.getNewsCategoryList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.newsCategoryList = res.data;
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

  newsCategoryFileChanged(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedNewsCategoryFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedNewsCategoryImage = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  editButtonClick(index) {

    const newsCategory = this.newsCategoryList[index];
    this.editIndex = index;
    this.isEdit = true;
    this.newsCategoryId = newsCategory.id;
    this.selectedNewsCategoryImage = newsCategory.image;
    this.title = newsCategory.title;
    this.description = newsCategory.description;

    this.status = newsCategory.status ? newsCategory.status.toString() : '0';
  }

  cancelEditClick() {

    this.isEdit = false;
    this.editIndex = null;
    this.image = '';
    this.selectedNewsCategoryImage = null;
    this.newsCategoryId = null;
    this.title = '';
    this.description = '';
    this.status = '0';
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete news category?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceNewsCategory.deleteNewsCategory(this.newsCategoryList[index].id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.newsCategoryList.splice(index, 1);
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

    if (this.selectedNewsCategoryImage == null && this.isEdit == false) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter news category title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter short category description.';
      this.snotify.onError();

    } else {

      const newsCategoryData: { [k: string]: any } = {

        title: this.title,
        description: this.description,
      };

      if (this.isEdit) {

        newsCategoryData.categoryId = this.newsCategoryId;
        newsCategoryData.status = this.status;

        this.serviceNewsCategory.updateNewsCategory(this.selectedNewsCategoryFile, newsCategoryData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.newsCategoryList[this.editIndex] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceNewsCategory.addNewsCategory(this.selectedNewsCategoryFile, newsCategoryData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.newsCategoryList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();
          });
      }
    }
  }

}
