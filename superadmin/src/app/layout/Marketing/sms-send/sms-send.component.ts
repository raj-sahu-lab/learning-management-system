import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { SmsApiHelper } from '../../../RestApiCall/ApiHelper/sms.service';


@Component({
  selector: 'app-sms-send',
  providers: [SmsApiHelper],
  templateUrl: './sms-send.component.html',
  styleUrls: ['./sms-send.component.scss']
})
export class SmsSendComponent implements OnInit {

  description = '';
  copyNumber = '';

  constructor(protected serviceSms: SmsApiHelper,public snotify: TostNotificationService) { }

  ngOnInit(): void {
  }

  submitButtonClick() {

    if (this.description == '') {

      this.snotify.body = 'Please type sms content.';
      this.snotify.onError();

    } else if (this.copyNumber == '') {

      this.snotify.body = 'Please enter contact number..';
      this.snotify.onError();

    } else {
      
      let sms: { [k: string]: any } = {

        description: this.description,
        copyNumber: this.copyNumber.split('\n'),
      };
     
      this.serviceSms.sendSms(sms).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.description = '';
        this.copyNumber = '';
      });

    }
  }
}
