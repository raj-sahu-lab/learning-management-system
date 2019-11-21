import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingApiHelper } from '../../../RestApiCall/ApiHelper/Setting.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {
  
  domain = '';
  User :any;

  constructor(public router: Router,protected servicesetting: SettingApiHelper, public snotify: TostNotificationService) { }

  ngOnInit(): void {

    this.User = JSON.parse(localStorage.getItem('User'));    
    this.domain = this.User.account_domain; 
  }

  submitButtonClick() {

    if (this.domain == '') {

      this.snotify.body = 'Please enter domain.';
      this.snotify.onError();

    } else {
      
      let domainData:{[k: string]: any} = {
        domain: ((this.domain).replace(" ", "")+".example.com"),
      };

      this.servicesetting.domain(domainData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        
        this.User['account_domain'] = this.domain;
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
