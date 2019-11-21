import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
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
  
  constructor(public redirectionService: RedirectionService, private route: ActivatedRoute, public router:Router,protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    // this.subjectId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getForumSubUrl().subscribe(id =>{
      this.subjectId = id;
    }));
    if(!this.subjectId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.forumSubId){
      this.subjectId = ids.forumSubId;
      }
    }
   }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
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
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.forumTopId = id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendForumTopUrl(id);
    });
    // this.router.navigate(['/student/forum/topic/'+id]);
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
