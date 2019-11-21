import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-topic',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.css']
})
export class ForumTopicComponent implements OnInit, OnDestroy {
  topicId: string;
  articleLists: any;
  redirectId: any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public router : Router, public route: ActivatedRoute, protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    this.subscriptions.push(this.redirectionService.getForumTopUrl().subscribe(id =>{
      this.topicId = id;
    }));
    if(!this.topicId){
      if(this.storage.get('forumTopId')){
        this.topicId = this.storage.get('forumTopId');
      }
    }
   }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.getArticleList();
  }

  goBack(){
    this.location.back();
  }

  getArticleList(){
    this.subscriptions.push(this.serviceForum.getForumArticles(this.topicId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
        this.articleLists = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(id : any){
    this.router.navigate(['./student/forum/article']).then(()=>{
      this.storage.set('forumArtId', id);
      this.redirectionService.sendForumArtUrl(id);
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
