import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { EmailTemplateApiHelper } from '../../../RestApiCall/ApiHelper/email-template.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  
  emailTemplateList = [];
  isEdit = false;
  emailTemplateId = null;

  title = '';
  subject = '';
  body = '';
  status = '0';
  
  constructor(public router: Router,protected serviceEmailTemplate: EmailTemplateApiHelper, public helperService: HelperService, public snotify: TostNotificationService) {
    }

  ngOnInit(): void {

    this.serviceEmailTemplate.getEmailTemplateList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.emailTemplateList = res.data;
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });
  }

  editButtonClick(emailTemplateId) {

    document.getElementById('startForm').scrollIntoView();

    const emailTemplate = this.emailTemplateList.find(obj => obj.id === emailTemplateId);
    this.isEdit = true;
    this.emailTemplateId = emailTemplateId;
    this.title = emailTemplate.email_title;
    this.subject = emailTemplate.email_subject;
    this.body = emailTemplate.email_body;
    this.status = emailTemplate.status ? emailTemplate.status.toString() : '0';

  }

  cancelEditClick() {

    this.isEdit = false;
    this.emailTemplateId = null;

    this.title = '';
    this.subject = '';
    this.body = '';
  }

  submitButtonClick() {

    if (this.title === '') {

      this.snotify.body = 'Please enter emaail title.';
      this.snotify.onError();

    } else  if (this.subject === '') {

      this.snotify.body = 'Please enter emaail subject.';
      this.snotify.onError();

    } else if (this.body === '') {

      this.snotify.body = 'Please enter emaail body.';
      this.snotify.onError();

    } else {

      const emailTemplateData: { [k: string]: any } = {

        email_title: this.title,
        email_subject: this.subject,
        email_body: this.body,
      };

      if (this.isEdit) {

        emailTemplateData.id = this.emailTemplateId;
        emailTemplateData.status = this.status;

        this.serviceEmailTemplate.updateEmailTemplate(emailTemplateData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.emailTemplateList[this.emailTemplateList.findIndex(obj => obj.id === this.emailTemplateId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.serviceEmailTemplate.addEmailTemplate(emailTemplateData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.emailTemplateList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();
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
