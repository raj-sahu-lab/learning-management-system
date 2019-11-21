import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { EmailApiHelper } from '../../../RestApiCall/ApiHelper/Email.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

declare var $: any;

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  options = false;

  learnerList = [];
  emailType = '0';

  campaignList = [];
  selectedDescription  :any;
  selectedPreview: any;
  recipientsReport:any;

  emailList = [];
  copyEmail = '';
  sendEmail: any;

  title = '';
  subject = '';
  description = '';
  attachment = '';
  selectedAttachmentFile : any;
  selectedAttachment : any;

  totalMails = null;
  totalSentMails = null;
  remainMails = null;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router,protected serviceLearner: LearnerApiHelper,protected serviceEmail: EmailApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;

    if (this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    $(document).ready(function() {
      $('#summernote').summernote();
    });

    $(document).on("click", function(event) {
      let $trigger = $(".dropdown");
      if($trigger !== event.target && !$trigger.has(event.target).length) {
          $(".dropdown-menu").removeClass("show");
      }
    });

      this.learners();
      this.campaign();
  }

  learners() {

    this.serviceLearner.getLearnerList('2').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.totalMails = res.data.totalMails;
        this.totalSentMails = res.data.totalSentMails;
        this.remainMails = res.data.remainMails;

        this.learnerList = res.data.learnerList;
        this.learnerList.forEach(learner => {
          learner.selected = false;
        });
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  campaign() {

     this.serviceEmail.getCampaignList().subscribe((res: ServerResponse) => {

      this.campaignList = res.data;
      this.helperService.loadDataTable();
    },
      (err) => {

        console.log(err);
      });
  }

  dropDownOptions() {

    this.options = !this.options;
  }

  emailChecked(email,event) {

    if (event.target.checked) {

      this.emailList.push(email);
    }

    if (!event.target.checked) {

      let index = this.emailList.indexOf(email);

      if (index > -1) {

        this.emailList.splice(index, 1);
      }
    }
  }

  allChecked(event) {
    
    this.emailList=[];

    this.learnerList.forEach(emailId => {

      // const student = document.getElementById(emailId.email) as HTMLInputElement;

      if (event.target.checked) {

        // student.checked = true;
        emailId.selected = true;
        this.emailList.push(emailId.email);
      } else {

        this.emailList=[];
        emailId.selected = false
        // student.checked = false;
      }

    });
  }

  FileChanged(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedAttachmentFile = fileInput.target.files[0];

      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedAttachment = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
      
    }
  }

  submitButtonClick() {

    this.description = $('#summernote').summernote('code');

    if(this.emailType == '0' && this.remainMails < this.emailList.length) {

      this.snotify.body = 'You can not select more then remaining Email.';
      this.snotify.onError();

    } else if(this.emailType == '1' && this.remainMails < this.copyEmail.split(",").length) {

      this.snotify.body = 'You can not copy more then remaining Email.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter email campaign title.';
      this.snotify.onError();

    } else if (this.subject == '') {

      this.snotify.body = 'Please enter email subject.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter email content.';
      this.snotify.onError();

    } else {

      if(this.emailType == '0') {
          this.sendEmail = this.emailList;

      } else if(this.emailType == '1') {

          const copyEmail = this.copyEmail;
          let oldEmailIds = copyEmail.split("\n");

          let newEmails = oldEmailIds.filter(item => item);
          this.sendEmail = newEmails;
      }

      const emailData:{[k: string]: any} = {

        title: this.title,
        subject: this.subject,
        mailContent: this.description,
        emailIdS: this.sendEmail
      };

      this.serviceEmail.sendEmail(this.selectedAttachmentFile,emailData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.learners();
        this.campaignList.unshift(res.data);

        this.selectedAttachmentFile= '';
        this.sendEmail= '';
        this.title='';
        this.subject='';
        this.description='';
        this.copyEmail='';
        this.emailList = [];

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });

    }

  }

  showPreview(campaignId) {

    this.selectedPreview = this.campaignList.find(obj => obj.id == campaignId);

    this.serviceEmail.campaignRecipients(this.selectedPreview.campaign_id).subscribe((res: ServerResponse) => {

      this.recipientsReport = res.data.statistics.globalStats;

    }, (err) => {

      console.log(err);
    });
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(campaignId) {

    this.selectedDescription = this.campaignList.find(obj => obj.id == campaignId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
