import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
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

  constructor(public redirectionService: RedirectionService, private route: ActivatedRoute, public router:Router,protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) {
    // this.categoryId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getForumCatUrl().subscribe(id =>{
      this.categoryId = id;
    }));
    if(!this.categoryId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.forumCatId){
        this.categoryId = ids.forumCatId;
      }
    }
   }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
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
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.forumSubId = id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendForumSubUrl(id);
    });
    // this.router.navigate(['/student/forum/subject/'+id]);
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
