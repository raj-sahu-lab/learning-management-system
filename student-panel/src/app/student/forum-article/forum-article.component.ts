import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { DiscussionForumService } from './../../RestApiCall/ApiHelper/discussion-forum.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
declare var $ : any;
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-article',
  templateUrl: './forum-article.component.html',
  styleUrls: ['./forum-article.component.css']
})
export class ForumArticleComponent implements OnInit, OnDestroy {
  articalId: any;
  text : any;
  article: any;
  discussions: any = [];
  message : string;
  page : number = 0;
  totalCount : any;
  replyMessage : string;
  defaultImage : any;
  private subscriptions: Subscription[] = [];

  constructor(public toastr : ToastrService, public discussionForumService: DiscussionForumService, public redirectionService: RedirectionService, public router : Router, public route: ActivatedRoute,protected serviceForum: ForumService, private location: Location) { 
    this.subscriptions.push(this.redirectionService.getForumArtUrl().subscribe(id =>{
      this.articalId = id;
    }));
    if(!this.articalId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.forumArtId){
      this.articalId = ids.forumArtId;
      }
    }
  }

  ngOnInit() {
    this.defaultImage = environment.baseUrl+'assets/img/icons/default_profile.png';
    
    this.getArticle();
    this.getDiscussionChat(this.page);
  }

  goBack(){
    this.location.back();
  }

  getArticle(){
    this.subscriptions.push(this.serviceForum.getForumArticle(this.articalId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
        this.article = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  getDiscussionChat(pageNumber){
    const data = {
      page : pageNumber
    }
    this.subscriptions.push(this.discussionForumService.getDiscussion(this.articalId,data).subscribe((res: ServerResponse) => {
      if (res && res.success) {
        this.discussions = res.data;
        if(res.data){
          this.totalCount = res.data.length;
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  viewMore(){
    
    const data = {
      page : ++this.page
    }
    this.subscriptions.push(this.discussionForumService.getDiscussion(this.articalId,data).subscribe((res: ServerResponse) => {
      if (res && res.success) {
        if(res.data){
          res.data.forEach(chat => {
            this.discussions.push(chat);
          });
          this.totalCount = res.data.length;
        }
      } else this.totalCount = 0;
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }
  
  postDiscussionChat(message : any){
    if(message){
      const data = {
        articleId : this.articalId,
        message : message
      }
      this.subscriptions.push(this.discussionForumService.postDiscussion(data).subscribe((res: ServerResponse) => {
        if (res && res.success) {
          this.discussions.push(res.data);
          this.message = '';
        }
      },
      (err) => {
        this.toastr.error(err.error);
      }));
    }
    
  }

  replyDiscussionChat(message : any, messageId : any,discussion : any){
    if(message){
      const data = {
        messageId : messageId,
        articleId : this.articalId,
        message : message
      }
      
      this.subscriptions.push(this.discussionForumService.replyDiscussion(data).subscribe((res: ServerResponse) => {
        if (res && res.success) {
          if(res.data){
            discussion.reply.push(res.data);
          }
          this.replyMessage = '';
        }
      },
      (err) => {
        this.toastr.error(err.error);
      }));
    }
    
  }

  openInput(id){
    var x = document.getElementById(id);
    if (x.style.display === "none") {
      x.style.display = "inline-flex";
    } else {
      x.style.display = "none";
    }
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
