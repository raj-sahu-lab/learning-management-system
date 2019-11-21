import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PrivacypoliciesApiHelper } from '../../../RestApiCall/ApiHelper/Privacypolicies.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';


@Component({
  selector: 'app-privacypolicies',
  
  providers: [PrivacypoliciesApiHelper],
  templateUrl: './privacypolicies.component.html',
  styleUrls: ['./privacypolicies.component.scss']
})
export class PrivacypoliciesComponent implements OnInit {

  privacypoliciesList = [];
  isEdit = false;
  privacypoliciesId = null;
  editIndex = null;
  
  title = '';
  description = '';

  loggedIn : any;
  public userType: number;

  constructor(public router: Router,protected servicePrivacypolicies: PrivacypoliciesApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.servicePrivacypolicies.getPrivacypoliciesList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.privacypoliciesId = res.data.id;
        this.title = res.data.title;
        this.description = res.data.description;
        this.isEdit = true;

      }
    },
      (err) => {

        console.log(err);
      });

  }

  submitButtonClick() {

    if (this.title == '') {

      this.snotify.body = 'Please enter title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter description.';
      this.snotify.onError();

    } else {
      
      let privacypoliciesData:{[k: string]: any} = {
        
        title: this.title,
        description: this.description,
      };

      if (this.isEdit) {

        privacypoliciesData.id = this.privacypoliciesId;
        
        this.servicePrivacypolicies.updatePrivacypolicies(privacypoliciesData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();
          
          if (res.success && res.success && res.data != null && this.editIndex != null) {
            
            this.privacypoliciesId = res.data.id;
            this.title = res.data.title;
            this.description = res.data.description;
            this.isEdit = true;
          
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);
      
          });
      } else {

        this.servicePrivacypolicies.addPrivacypolicies(privacypoliciesData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {
            
            this.privacypoliciesId = res.data.id;
            this.title = res.data.title;
            this.description = res.data.description;
            this.isEdit = true;
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);
          });
      }
    }
  }
 
}
