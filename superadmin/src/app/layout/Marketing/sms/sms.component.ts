import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { InstituteApiHelper } from '../../../RestApiCall/ApiHelper/institute.service';
import { SmsApiHelper } from '../../../RestApiCall/ApiHelper/sms.service';

@Component({
  selector: 'app-sms',
  providers: [InstituteApiHelper,SmsApiHelper],
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  instituteList = [];
  instituteId = undefined;
  sms = null;
  isEdit = false;

  constructor(protected serviceInstitute: InstituteApiHelper,protected serviceSms: SmsApiHelper, public snotify: TostNotificationService) { }

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
    this.sms = '';

  }

  submitButtonClick() {

    if (this.instituteId == null) {

      this.snotify.body = 'Select institute.';
      this.snotify.onError();

    } else if (this.sms == null) {

      this.snotify.body = 'Please enter SMS.';
      this.snotify.onError();

    } else {

      let sms: { [k: string]: any } = {

        totalSMS: this.sms,
        accountId: this.instituteId,
      };
     
      this.serviceSms.addSms(sms).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        this.cancelEditClick();
      });
      
    }
  }
}
