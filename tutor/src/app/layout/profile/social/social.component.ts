import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  loggedIn : any;
  public userType: number;
  
  constructor(public router: Router) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

  }

}
