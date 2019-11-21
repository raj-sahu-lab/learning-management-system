import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { ReviewAndRatingService } from './../../RestApiCall/ApiHelper/review-and-rating.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: any;
  reviewSele: any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public reviewService : ReviewAndRatingService, public router : Router,protected serviceDashboard: DashboardApiHelper, private toastr: ToastrService, public helperService: HelperService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;

    this.getReview();
  }

  goBack(){
    this.location.back();
  }

  getReview(){
    this.subscription = this.reviewService.getReviews().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        this.reviews = res.data.reverse();
      }
    },
      (err) => {
        this.toastr.error(err.error);
      });
  }

  reviewSelected(review){
    this.reviewSele = review;
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
