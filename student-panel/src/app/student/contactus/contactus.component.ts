import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {


  conatcts = [];
  user: any;

  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.conatcts.push(this.user);
  }

}
