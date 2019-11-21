import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingApiHelper } from '../../../RestApiCall/ApiHelper/Setting.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import timezones from 'compact-timezone-list';

@Component({
  selector: 'app-time-zone',
  templateUrl: './time-zone.component.html',
  styleUrls: ['./time-zone.component.scss']
})
export class TimeZoneComponent implements OnInit {

  User :any;
  timeZone : undefined;
  timeZoneList = [];

  loggedIn : any;
  public userType: number;

  constructor(public router: Router,protected servicesetting: SettingApiHelper, public snotify: TostNotificationService) { }

  ngOnInit(): void {

    this.timeZoneList = timezones;
    this.User = JSON.parse(localStorage.getItem('User'));
    this.userType = this.User.userType;
    this.timeZone = this.User.time_zone;

    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

  }

  submitButtonClick() {

    if (this.timeZone == '') {

      this.snotify.body = 'Please select time zone.';
      this.snotify.onError();

    } else {
      
      let timeZoneData:{[k: string]: any} = {
        
        timeZone: this.timeZone,
      };

      this.servicesetting.setTimeZone(timeZoneData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.User['time_zone'] = this.timeZone;
        localStorage.setItem('User', JSON.stringify(this.User));
        
        this.router.navigate(['/setting']);

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
    
        });
      
    }
  }

}
