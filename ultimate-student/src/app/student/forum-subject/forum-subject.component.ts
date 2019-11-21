import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-subject',
  templateUrl: './forum-subject.component.html',
  styleUrls: ['./forum-subject.component.css']
})
export class ForumSubjectComponent implements OnInit, OnDestroy {
  subjectId: string;
  topicLists: any;
  redirectId: any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private route: ActivatedRoute, public router:Router,protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    this.subscriptions.push(this.redirectionService.getForumSubUrl().subscribe(id =>{
      this.subjectId = id;
    }));
    if(!this.subjectId){
      if(this.storage.get('forumSubId')){
      this.subjectId = this.storage.get('forumSubId');
      }
    }
   }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;

    this.getTopicList();
  }

  goBack(){
    this.location.back();
  }

  getTopicList(){
    this.subscriptions.push(this.serviceForum.getForumTopic(this.subjectId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
        this.topicLists = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(id : any){
    this.router.navigate(['./student/forum/topic']).then(()=>{
      this.storage.set('forumTopId', id);
      this.redirectionService.sendForumTopUrl(id);
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
