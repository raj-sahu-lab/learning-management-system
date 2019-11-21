import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { Subscription } from 'rxjs';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { ReviewAndRatingService } from './../../RestApiCall/ApiHelper/review-and-rating.service';
import { SupportRequestService } from './../../RestApiCall/ApiHelper/support-request.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { NewsService } from './../../RestApiCall/ApiHelper/news.service';
import { ToastrService } from 'ngx-toastr';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
declare var $: any;

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, OnDestroy {

  
  supportRequests : any ;
  // course : any;
  // type : any;
  courseLists : any;
  reviews : any = [];
  subjectId : number = 0;
  rating : number;
  reviewDescription : string;
  errorMessage : string = '';
  redirectId: any;
  supportRequestsTypes: any = [{}];
  supportCreate : any = {};
  supportCourses : any;
  news : any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public supportRequestService : SupportRequestService, public redirectionService: RedirectionService, public reviewService : ReviewAndRatingService, public router : Router,protected serviceDashboard: DashboardApiHelper, public helperService: HelperService, private toastr: ToastrService, public newsService : NewsService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;

    this.getReview();
    this.getSupportRequest();
    this.getNews();
    this.corousel();
  }

  getReview(){
    this.subscriptions.push(this.reviewService.getReviews().subscribe((res: ServerResponse) => {
      
      if (res && res.success && res.data != null) {
        this.reviews = res.data.reverse();
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  getSupportRequest(){
    this.subscriptions.push(this.supportRequestService.getSupportRequest().subscribe((res: ServerResponse) => {
      
      if (res && res.success && res.data != null) {
        this.supportRequests = res.data.reverse();
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  getNews(){
    this.subscriptions.push(this.newsService.getNewsCategory().subscribe((res: ServerResponse) => {
      if (res && res.success && res.data != null) {
        this.news = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  corousel(){
    $(document).ready(function () {
      
      $('#carousel-example').on('slide.bs.carousel', function (e) {
        
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 4;
        var totalItems = $('.carousel-item').length;
        
        if (idx >= totalItems-(itemsPerSlide-1)) {
            var it = itemsPerSlide - (totalItems - idx);
            
            for (var i=0; i<it; i++) {
                // append slides to end
                if (e.direction=="left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                }
                else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
      });
    });
  }

  getSupportRequestType(){
    this.subscriptions.push(this.supportRequestService.getStctTypesList().subscribe((res: ServerResponse) => {
      
      if (res && res.success && res.data != null) {
        this.supportRequestsTypes =[];
        res.data.forEach(supportData => {
          if(supportData.list.length > 0){
            this.supportRequestsTypes.push(supportData);
          }
        });
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  getSupportCourse(id){
    this.supportRequestsTypes.forEach(typeList => {
      if(typeList.type == id){
        this.supportCourses = typeList.list;
        this.supportCreate.courseId =undefined;
      }
    });
  }

  createSupportRequest(){
    let data : any= {
      "type" : this.supportCreate.typeId,
      "name" : this.supportCreate.name,
      "description" : this.supportCreate.description
    }
    if(this.supportCreate.courseId){
      data.typeId = this.supportCreate.courseId;
    }
    
    this.subscriptions.push(this.supportRequestService.postSupportRequest(data).subscribe((res: ServerResponse) => {
        
      if (res.success) {
        
        this.toastr.success(res.message) ;
        if(this.supportRequests){
          this.supportRequests.unshift(res.data);
        } else this.supportRequests = [res.data];
        let closeReview: HTMLElement = document.getElementById('closeSupportModal') as HTMLElement;
        closeReview.click();
      }
    },
      (err) => {
        this.toastr.error(err.error) ;
      }));

  }

  setRating(rate){
    this.rating = rate;
  }

  submitReview(){
    if(this.subjectId>0 && this.rating && this.reviewDescription){

      let data = {
        'type' : 1,
        'id' : this.subjectId,
        'ratting' : this.rating,
        'review' : this.reviewDescription 
      }
      
      this.subscriptions.push(this.reviewService.submitReview(data).subscribe((res: ServerResponse) => {
        
        if (res.success) {
          this.clearReview();
          this.getReview();
          let closeReview: HTMLElement = document.getElementById('closePostReview') as HTMLElement;
          closeReview.click();
        }
      },
        (err) => {
          this.errorMessage = err.error;
          this.toastr.error(err.error);
        }));
    } else if(!this.rating){
      this.errorMessage = "Please select rating";
    } else if(!this.subjectId){
      this.errorMessage = "Please select subject";
    } else if(!this.reviewDescription){
      this.errorMessage = "Please write something";
    }
  }

  clearReview(){
    this.errorMessage = '';
    this.rating = undefined;
    this.subjectId = 0;
    this.reviewDescription = undefined;
    $('input:radio[name=rating]').each(function () { $(this).prop('checked', false); });;
  }

  getCourseList() {
    this.subscriptions.push(this.serviceDashboard.getReviewCourse().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        this.courseLists = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  requestNavigate(suppordata : any){
    this.router.navigate(['./student/supportrequest/']).then(()=>{
      this.storage.set('supportRequest', suppordata);
      const data = {
        'supportData' : suppordata,
        'direct' : 0,
      }
      this.redirectionService.sendSupportRequestUrl(data);
    });
  }

  newsNavigation(newsCat){
    this.router.navigate(['/student/news/category']).then(()=>{
      this.storage.set('newCategory',newsCat);
    });
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => {
        if(subscription){
          subscription.unsubscribe();
        }
      });
    }
  }

}
