import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { ReviewApiHelper } from '../../../RestApiCall/ApiHelper/Review.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  filter: boolean = false;
  columLearner = true;
  columType = true;
  columCourse = true;
  columReview = true;
  columRating = true;

  public loginUser: any;
  public userType: number;  
  public accountId: number;

  reviewList = [];
  
  constructor(public router: Router, protected serviceReview: ReviewApiHelper, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.loginUser = User;
    this.accountId = this.userType == 1 ? User.account_id :  User.accountId;

    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceReview.getReviewList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.reviewList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.helperService.loadDataTable();
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

}
