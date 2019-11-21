import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePasswordApiHelper } from '../RestApiCall/ApiHelper/ChangePassword.service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../RestApiCall/NetworkLayer/toast-notification.service';
import { BaseService } from '../RestApiCall/NetworkLayer/base.service';

@Component({
  selector: 'app-changepassword',
  providers: [ChangePasswordApiHelper],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  token = '';
  password = '';
  cpassword = '';
  changePasswordMessage = '';

  constructor(protected baseService: BaseService,private route: ActivatedRoute,protected serviceChangePassword: ChangePasswordApiHelper, public router: Router, public snotify: TostNotificationService) {
    this.token = this.route.snapshot.paramMap.get('token');    
   }

  ngOnInit() {
  }

  changePassword() {
    
    if (this.password == '') {

        this.snotify.body = 'Please enter password';
        this.snotify.onError();
        
    } else if (this.cpassword == '') {

        this.snotify.body = 'Please enter confirm password';
        this.snotify.onError();
        
    } else if (this.password != this.cpassword) {

      this.snotify.body = 'Confirm password is not metch';
      this.snotify.onError();
      
    } else if (this.password.length < 6 || this.password.length > 16) {
      
      this.snotify.body = 'Please enter password between 6 to 16 characters.';
      this.snotify.onError();

    } else if (this.password.search(/\d/) == -1) {

      this.snotify.body = 'Password must contain number.';
      this.snotify.onError();
      
    } else if (this.password.search(/[a-zA-Z]/) == -1) {

      this.snotify.body = 'Password must contain letter.';
      this.snotify.onError();
        
    } else if (this.password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

      this.snotify.body = 'Password must contain special character.';
      this.snotify.onError();
        
    } else {

      let passwordData:{[k: string]: any} = {
        
       password: this.password,
      };
      
      this.serviceChangePassword.changePassword(passwordData,this.token).subscribe((res: ServerResponse) => {

      if (res.success) {

        this.router.navigate(['/']);
        this.snotify.body = res.message;
        this.snotify.onSuccess();
      }

    },
      (err) => {

        console.log(err);
        this.snotify.body = err.error;
        this.snotify.onError();
      });

    }

  }

}
