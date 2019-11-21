import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
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

  constructor(public redirectionService: RedirectionService, public router : Router, public route: ActivatedRoute, protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    // this.topicId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getForumTopUrl().subscribe(id =>{
      this.topicId = id;
    }));
    if(!this.topicId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.forumTopId){
        this.topicId = ids.forumTopId;
      }
    }
   }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
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
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.forumArtId = id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendForumArtUrl(id);
    });
    // this.router.navigate(['/student/forum/article/'+id]);
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
