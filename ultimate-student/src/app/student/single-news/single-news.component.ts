import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrls: ['./single-news.component.scss']
})
export class SingleNewsComponent implements OnInit {

  news : any;
  constructor(private location: Location, public router: Router) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

}
