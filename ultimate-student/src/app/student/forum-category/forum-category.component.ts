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
  selector: 'app-forum-category',
  templateUrl: './forum-category.component.html',
  styleUrls: ['./forum-category.component.css']
})
export class ForumCategoryComponent implements OnInit, OnDestroy {
  
  categoryId: string;
  subjectLists: any;
  redirectId: any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private route: ActivatedRoute, public router:Router,protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    this.subscriptions.push(this.redirectionService.getForumCatUrl().subscribe(id =>{
      this.categoryId = id;
    }));
    if(!this.categoryId){
      if(this.storage.get('forumCatId')){
        this.categoryId = this.storage.get('forumCatId');
      }
    }
   }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;

    this.getSubjectList();
  }

  goBack(){
    this.location.back();
  }

  getSubjectList(){
    this.subscriptions.push(this.serviceForum.getForumSubject(this.categoryId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
          this.subjectLists = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  navigateUrl(id : any){
    this.router.navigate(['./student/forum/subject']).then(()=>{
      this.storage.set('forumSubId',id);
      this.redirectionService.sendForumSubUrl(id);
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
