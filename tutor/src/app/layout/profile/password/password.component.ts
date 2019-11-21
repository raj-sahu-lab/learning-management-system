import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PasswordApiHelper } from '../../../RestApiCall/ApiHelper/Password.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-password',
  providers: [PasswordApiHelper],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(protected servicePassword: PasswordApiHelper, public snotify: TostNotificationService, public router: Router) { }

  ngOnInit() {
  }

  cancelEditClick() {

    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  submitButtonClick() {

    if (this.oldPassword == '') {

      this.snotify.body = 'Please enter old password.';
      this.snotify.onError();

    } else if (this.newPassword == '') {

      this.snotify.body = 'Please enter new password.';
      this.snotify.onError();

    } else if (this.confirmPassword == '') {

      this.snotify.body = 'Please enter confirm password.';
      this.snotify.onError();

    } else if (this.confirmPassword != this.newPassword) {

      this.snotify.body = 'Confirm password not metch.';
      this.snotify.onError();

    } else if (this.newPassword.length < 6 || this.newPassword.length > 16) {
      
      this.snotify.body = 'Please enter password between 6 to 16 characters.';
      this.snotify.onError();

    } else if (this.newPassword.search(/\d/) == -1) {

      this.snotify.body = 'Password must contain number.';
      this.snotify.onError();
      
    } else if (this.newPassword.search(/[a-zA-Z]/) == -1) {

        this.snotify.body = 'Password must contain letter.';
        this.snotify.onError();
        
    } else if (this.newPassword.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

      this.snotify.body = 'Password must contain special character.';
      this.snotify.onError();
        
    } else {
      
      let passwordData:{[k: string]: any} = {
        
        newPassword: this.newPassword,
        password: this.oldPassword,
      };

      this.servicePassword.updatePassword(passwordData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        localStorage.removeItem('isLoggedin');

        localStorage.removeItem('loggedIn'); // Encrypted Data
        this.router.navigate(['/login']);

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
    
        });
      
    }
  }

}