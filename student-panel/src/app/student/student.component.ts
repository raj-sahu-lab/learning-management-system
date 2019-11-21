import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  windowWidth : any;
  constructor(public router: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('User')){
      this.router.navigate(['']);
    }

    this.windowWidth = $(window).outerWidth();
    if(this.windowWidth<768){
      $("#app-container").addClass("menu-mobile");
    }
  }

}
