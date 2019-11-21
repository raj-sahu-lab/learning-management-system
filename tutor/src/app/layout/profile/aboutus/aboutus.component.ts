import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AboutusApiHelper } from '../../../RestApiCall/ApiHelper/Aboutus.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-aboutus',
  providers: [AboutusApiHelper],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})

export class AboutusComponent implements OnInit {

  aboutusList = [];
  isEdit = false;
  aboutusId = null;
  editIndex = null;
  
  title = '';
  description = '';

  loggedIn : any;
  public userType: number;

  constructor(public router: Router,protected serviceAboutus: AboutusApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.serviceAboutus.getAboutusList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.aboutusId = res.data.id;
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
      
      let aboutusData:{[k: string]: any} = {
        
        title: this.title,
        description: this.description,
      };

      if (this.isEdit) {

        aboutusData.id = this.aboutusId;
        
        this.serviceAboutus.updateAboutus(aboutusData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();
          
          if (res.success && res.success && res.data != null && this.editIndex != null) {
            
            this.aboutusId = res.data.id;
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

        this.serviceAboutus.addAboutus(aboutusData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {
            
            this.aboutusId = res.data.id;
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