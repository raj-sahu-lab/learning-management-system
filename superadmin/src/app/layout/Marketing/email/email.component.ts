import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { InstituteApiHelper } from '../../../RestApiCall/ApiHelper/institute.service';
import { EmailApiHelper } from '../../../RestApiCall/ApiHelper/email.service';

@Component({
  selector: 'app-email',
  providers: [InstituteApiHelper,EmailApiHelper],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  instituteList = [];
  instituteId = undefined;
  email = null;
  isEdit = false;

  constructor(protected serviceInstitute: InstituteApiHelper,protected serviceEmail: EmailApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {

    this.serviceInstitute.getInstituteList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {

        this.instituteList = res.data;
        
      }
    },
      (err) => {

        console.log(err);
      });

  }

  cancelEditClick() {
   
    this.instituteId = undefined;
    this.email = '';

  }

  submitButtonClick() {

    if (this.instituteId == null) {

      this.snotify.body = 'Select institute.';
      this.snotify.onError();

    } else if (this.email == null) {

      this.snotify.body = 'Please enter email.';
      this.snotify.onError();

    } else {

      let email: { [k: string]: any } = {

        totalEmail: this.email,
        accountId: this.instituteId,
      };
     
      this.serviceEmail.addEmail(email).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        this.cancelEditClick();
      });
      
    }
  }
}
