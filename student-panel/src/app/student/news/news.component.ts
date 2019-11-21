import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  news : any;
  instituteLogo : any;

  constructor(private location: Location, public router: Router) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;
  }

  goBack(){
    this.location.back();
  }

  navigateUrl(){
    this.router.navigate(['/student/news/1']);
  }
}
