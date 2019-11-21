import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { NumberFormatStyle } from '@angular/common';

import { TermApiHelper } from '../../../RestApiCall/ApiHelper/term.service';
declare var $: any;

@Component({
  selector: 'app-test',
  providers: [TermApiHelper],
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})

export class TermComponent implements OnInit {

  termList = [];
  isEdit = false;
  termId = null;

  title = '';
  month = '';
  days = '';

  constructor(protected serviceTerm: TermApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceTerm.getTermList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.termList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

  deleteButtonClick(termId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete term?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceTerm.deleteTerm(termId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.termList.splice(this.termList.findIndex(obj => obj.id == termId), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }

      }, (err) => {

        console.log(err);

      });

    }, (no) => {

      console.log("NO");

    });
  }

  editButtonClick(termId) {

    const term = this.termList.find(obj => obj.id == termId);
    this.isEdit = true;
    this.termId = termId;

    this.title = term.title;
    this.month = term.month;
    this.days = term.days;

    document.getElementById('startForm').scrollIntoView();
  }

  cancelEditClick() {

    this.isEdit = false;
    this.termId = null;

    this.title = '';
    this.month = '';
    this.days = '';

  }

  submitButtonClick() {

    if (this.title == '') {

      this.snotify.body = 'Please enter title.';
      this.snotify.onError();

    } else if (this.month == '') {

      this.snotify.body = 'Please enter month.';
      this.snotify.onError();

    } else if (this.days == '') {

      this.snotify.body = 'Please enter days.';
      this.snotify.onError();

    } else {

      const termData: { [k: string]: any } = {

        title: this.title,
        month: this.month,
        days: this.days,
      };

      if (this.isEdit) {

        termData.termId = this.termId;

        this.serviceTerm.updateTerm(termData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.termList[this.termList.findIndex(obj => obj.id === this.termId)] = res.data;
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

        this.serviceTerm.addTerm(termData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.termList.unshift(res.data);
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
