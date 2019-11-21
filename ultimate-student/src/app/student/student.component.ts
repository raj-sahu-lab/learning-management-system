import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  windowWidth : any;
  constructor() { }

  ngOnInit() {
    this.windowWidth = $(window).outerWidth();
    if(this.windowWidth<768){
      $("#app-container").addClass("menu-mobile");
    }
  }

}
