import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, OnDestroy {

  forumCategories : any;
  popularArticles : any;
  redirectId: any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public router: Router, public redirectionService: RedirectionService, protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.getForumList();
  }

  goBack(){
    this.location.back();
  }

  getForumList(){
    this.subscription = this.serviceForum.getForumDetails().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
        if(res.data.category){
          this.forumCategories = res.data.category;
          
        }
        if(res.data.populerArtical){
          this.popularArticles = res.data.populerArtical;
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  navigateUrl(cat){
    this.router.navigate(['./student/forum/category']).then(()=>{
      this.storage.set('forumCatId',cat.id);
      this.redirectionService.sendForumCatUrl(cat.id);
    });
  }

  navigateArticleUrl(article){
    this.router.navigate(['./student/forum/article']).then(()=>{
      this.storage.set('forumArtId',article.id);
      this.redirectionService.sendForumArtUrl(article.id);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
