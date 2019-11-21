import { Component, OnInit } from '@angular/core';
import { ForGotPasswordApiHelper } from '../RestApiCall/ApiHelper/ForGotPassword.service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-forgotpassword',  
  providers: [ForGotPasswordApiHelper],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  userEmail='';

  constructor(protected serviceForGotPassword: ForGotPasswordApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {
  }

  submitButtonClick() {

    if (this.userEmail == '' ) {

      this.snotify.body = 'Please enter email id.';
      this.snotify.onError();

    } else {

        this.serviceForGotPassword.sendEmail(this.userEmail).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success) {

            this.userEmail ='';
            //console.log(res.data);
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
