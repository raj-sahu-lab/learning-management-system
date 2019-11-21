import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { SupportApiHelper } from '../../../RestApiCall/ApiHelper/Support.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { log } from 'util';

@Component({
  selector: 'app-support',
  providers: [SupportApiHelper],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  supportRequestList = [];
  supportId= undefined;

  tutorList: any;
  tutorId = undefined;

  assignedTutor = null;

  public loginUser: any;
  public userType: number;  
  public accountId: number;

  constructor(public router: Router, protected serviceSupport: SupportApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.loginUser = User;
    this.accountId = this.userType == 1 ? User.account_id :  User.accountId;

    localStorage.removeItem("supportRequest");

    this.supportList();
  }

  supportList() {

    this.serviceSupport.getSupportRequestList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.supportRequestList = res.data;
        console.log(this.supportRequestList);
      }
    },
      (err) => {

        console.log(err);
      });
  }

  showDescription(supportId,branchId){
    
    this.supportId = supportId;

    this.supportRequestList.forEach(support => {
      
      if(support.id == supportId)
      {
        this.assignedTutor = support.authority;
      }

    });
      
    this.serviceSupport.getTutorList(branchId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.tutorList = res.data;
      }
    }, (err) => {

      console.log(err);
    });

  }
  
  hideDescription(){

    this.tutorList = null;
    this.supportId= undefined;
    this.tutorId = undefined;
  }

  submitButtonClick() {
    
    if (this.tutorId == undefined) {

      this.snotify.body = 'Please select educator.';
      this.snotify.onError();

    } else {      
      
      let tutorData:{[k: string]: any} = {
      
        id: this.supportId,
        authorityId: this.tutorId
      };
     
      this.serviceSupport.assignAuthority(tutorData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();        

        if (res.success && res.data != null) {

          this.supportList();
          this.hideDescription();
        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });
     
    }
  }

  viewChat(index) {

    const supportRequest = {
      'supportData' : this.supportRequestList[index],
      'direct' : 0
    }
    
    localStorage.setItem("supportRequest", JSON.stringify(supportRequest));

    this.router.navigate(['/supportChat',supportRequest.supportData.id]);
  }

}
