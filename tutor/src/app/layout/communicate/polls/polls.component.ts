import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PollsApiHelper } from '../../../RestApiCall/ApiHelper/Polls.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-polls',
  providers: [PollsApiHelper],
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})

export class PollsComponent implements OnInit {

  selectedDescription: any;

  pollsList = [];
  isEdit = false;
  pollsId = null;
  editIndex = null;

  title = '';
  pollsOptionList = [];
  options = [];

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public router: Router,protected servicePolls: PollsApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    if(this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }

    this.servicePolls.getPollsList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.pollsList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

    // for default 3 option
    this.addButtonClick();
    this.addButtonClick();
    this.addButtonClick();

  }

  deleteButtonClick(pollsId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete poll?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePolls.deletePolls(pollsId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.pollsList.splice(this.pollsList.findIndex(obj => obj.id == pollsId), 1);
          this.helperService.loadDataTable();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  submitButtonClick() {

    if (this.title == '') {

      this.snotify.body = 'Please enter polls title.';
      this.snotify.onError();

    } else {

      const pollsData: {[k: string]: any} = {

        title: this.title,
        options: this.options
      };

      this.servicePolls.addPolls(pollsData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {

          this.pollsList.unshift(res.data);
          this.helperService.loadDataTable();
          this.title = '';
          this.pollsOptionList = [];
          this.options = [];

        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });

    }
  }

  addButtonClick() {

    let option: '';
    this.pollsOptionList.push(option);
  }

  removeButtonClick(index) {

    this.pollsOptionList.splice(index, 1);
  }

  showDescription(pollsId) {

    this.servicePolls.resultPolls(pollsId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.selectedDescription = res.data;

      }
    }, (err) => {

      console.log(err);
    });
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
