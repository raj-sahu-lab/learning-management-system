import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';

import { NewsCategoryApiHelper } from '../../../RestApiCall/ApiHelper/NewsCategory.service';
import { NewsApiHelper } from '../../../RestApiCall/ApiHelper/News.service';
declare var $: any;
import { NgxImageCompressService} from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import * as moment from 'moment-timezone';

@Component({
  selector: 'app-news',
  providers: [NewsCategoryApiHelper, NewsApiHelper],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  filter = false;

  isEdit = false;
  newsList = [];
  newsId = null;

  editIndex = null;

  newsCategoryList = [];
  newsCategoryId = undefined;

  image = '';
  title = '';
  dateTime = '';
  description = '';
  status = '0';

  selectedNewsImage: any;
  selectedNewsFile: any;

  columImage = true;
  columTitle = true;
  columNewsDate = true;
  columDescription = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;
  isCustomDatePicker : Boolean = false;

 constructor(public router: Router, protected serviceNewsCategory: NewsCategoryApiHelper, protected serviceNews: NewsApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    var thisBrowser = this.myBrowser();
    if(thisBrowser == "Safari" || thisBrowser == "IE"){
      this.isCustomDatePicker = true
    } else {
      this.dateTime = moment().tz(User.time_zone).format('YYYY-MM-DD')+'T'+moment().tz(User.time_zone).format('HH:mm');
    }

    this.serviceNewsCategory.getNewsCategoryList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.newsCategoryList = res.data;

      }
    },
      (err) => {

        console.log(err);
      });

      this.serviceNews.getNewsList().subscribe((res: ServerResponse) => {

        if (res.success && res.data != null) {

          this.newsList = res.data;
          this.helperService.loadDataTable();
        }
      },
        (err) => {

          console.log(err);
        });
  }

  myBrowser() { 
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    }else if(navigator.userAgent.indexOf("Chrome") != -1 ){
        return 'Chrome';
    }else if(navigator.userAgent.indexOf("Safari") != -1){
        return 'Safari';
    }else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
         return 'Firefox';
    }else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.DOCUMENT_NODE == true )){
      return 'IE'; 
    } else {
       return 'unknown';
    }
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  newsFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {
      fileName = fileInput.target.files[0]['name'];
      const reader = new FileReader();

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);
        this.selectedNewsImage = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  compressImage(image, fileName) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);
        // imageFile created below is the new compressed file which can be send to API in form data
        this.selectedNewsFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  editButtonClick(index) {

    const news = this.newsList[index];

    this.editIndex = index;
    this.isEdit = true;
    this.newsId = news.id;
    this.newsCategoryId = news.newsCategory.id;
    this.selectedNewsImage = news.image;
    this.title = news.title;
    this.dateTime = news.dateTime;
    this.description = news.description;

    this.status = news.status ? news.status.toString() : '0';
  }

  cancelEditClick() {

    this.isEdit = false;
    this.editIndex = null;
    this.image = '';
    this.selectedNewsImage = null;
    this.newsCategoryId = undefined;
    this.title = '';
    this.dateTime = '';
    this.description = '';
    this.status = '0';
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete news?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceNews.deleteNews(this.newsList[index].id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.newsList.splice(index, 1);
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

    if (this.selectedNewsImage == null && this.isEdit == false) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

    } else if (this.newsCategoryId == null) {

      this.snotify.body = 'Please select news category.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter news title.';
      this.snotify.onError();

    } else if (this.dateTime == '') {

      this.snotify.body = 'Please enter publish date.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter news body content .';
      this.snotify.onError();

    } else {

      const newsData: { [k: string]: any } = {

        categoryId: this.newsCategoryId,
        title: this.title,
        description: this.description,
        dateTime: this.dateTime,
      };

      if (this.isEdit) {

        newsData.newsId = this.newsId;
        newsData.status = this.status;

        this.serviceNews.updateNews(this.selectedNewsFile, newsData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.newsList[this.editIndex] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceNews.addNews(this.selectedNewsFile, newsData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.newsList.unshift(res.data);
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
