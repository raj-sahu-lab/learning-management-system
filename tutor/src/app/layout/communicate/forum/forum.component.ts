import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-forum',
  providers: [ForumApiHelper],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent implements OnInit {

  selectedDescription: any;

  categoryTotal = null;
  subjectTotal = null;
  topicTotal = null;
  articleTotal = null;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router,protected serviceForum: ForumApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }
    
    this.forum();
  }  

  forum()
  {
    this.serviceForum.getForumCount().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.categoryTotal = res.data.categoryTotal;
        this.subjectTotal = res.data.subjectTotal;
        this.topicTotal = res.data.topicTotal;
        this.articleTotal = res.data.articleTotal;
      }
    },
      (err) => {

        console.log(err);
      });
  }

}
