import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { NewsService } from './../../RestApiCall/ApiHelper/news.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-category-list',
  templateUrl: './news-category-list.component.html',
  styleUrls: ['./news-category-list.component.scss']
})
export class NewsCategoryListComponent implements OnInit, OnDestroy {

  news : any;
  newsCat : any;
  newsSeleData : any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private location: Location, public router: Router, public newsService : NewsService, private toastr: ToastrService) {
   }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;

    this.newsCat = this.storage.get('newCategory');
    this.getNews();
  }

  getNews(){
    if(this.newsCat.id){
      const data = {
        categoryId : this.newsCat.id
      }
      this.subscription = this.newsService.getNews(data).subscribe((res: ServerResponse) => {
        
        if (res && res.success && res.data != null) {
          this.news = res.data;
        }
      },
        (err) => {
          this.toastr.error(err.error);
        });
    }
  }

  goBack(){
    this.location.back();
  }

  newsSelected(news){
    this.newsSeleData = news;
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
