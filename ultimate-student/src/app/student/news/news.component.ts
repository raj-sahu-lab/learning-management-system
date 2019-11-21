import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  news : any;
  instituteLogo : any;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private location: Location, public router: Router) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
  }

  goBack(){
    this.location.back();
  }

  navigateUrl(){
    this.router.navigate(['/student/news/1']);
  }
}
