import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ForumService } from './../../RestApiCall/ApiHelper/forum.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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

  constructor(public router: Router, public redirectionService: RedirectionService, protected serviceForum: ForumService, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
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
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.forumCatId = cat.id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendForumCatUrl(cat.id);
    });
  }

  navigateArticleUrl(article){
    this.router.navigate(['./student/forum/article']).then(()=>{
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.forumArtId = article.id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendForumArtUrl(article.id);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
