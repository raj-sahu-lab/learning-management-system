import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { FeesApiHelper } from '../../../RestApiCall/ApiHelper/Fees.service';
import { log } from 'util';

import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-fees',
  providers: [BranchApiHelper, LearnerApiHelper, FeesApiHelper],
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements OnInit {

  learnerList = [];
  typesList = [];
  courseList = [];

  type: undefined;
  course: undefined;
  amount = '';

  paymentGateWayId: number;
  currencyId: number;

  branchList = [];
  branchId = undefined;

  studentId = [];
  loggedIn : any;
  public userType: number;

  constructor(public router: Router, protected serviceBranch: BranchApiHelper, protected serviceLearner: LearnerApiHelper, protected serviceFees: FeesApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if (this.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }
    
    this.serviceBranch.getBranchList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.branchList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  typeList() {

    this.cancelEditClick();

    this.serviceFees.getTypesList(this.branchId).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        res.data.forEach(type => {

          if (type.list.length !== 0) {
            this.typesList.push(type);
          }

        });

      }
    },
      (err) => {

        console.log(err);
      });
  }

  typeChanged() {

    this.course = undefined;
    this.amount = '';

    this.typesList.forEach(types => {

      if (this.type == types.type) {
        this.courseList = types.list;
      }
    });
  }

  selectedCourse() {
    
    this.courseList.forEach(amounts => {
      
      if (this.course == amounts.id) {
        
        this.amount = amounts.amount;
        this.paymentGateWayId = amounts.paymentGateWayId,
        this.currencyId = amounts.currencyId,

        this.learnerListGet();
      }
    });
  }

  learnerListGet() {

    this.serviceLearner.getLearnerListUnpaid('3', this.type, this.course).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.learnerList = res.data;
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

  cancelEditClick() {

    this.type = undefined;
    this.course = undefined;
    this.amount = '';
    this.studentId = [];

    this.courseList = [];
    this.learnerList = [];
    this.typesList = [];
  }

  studentCheck(learnerId, event) {

    if (event.target.checked) {

      this.studentId.push(learnerId);
    }

    if (!event.target.checked) {

      const index = this.studentId.indexOf(learnerId);

      if (index > -1) {

        this.studentId.splice(index, 1);
      }
    }

  }

  selectAll(event) {
    this.studentId = [];
    for (let i = 0; i < this.learnerList.length; i++) {

      // const student = document.getElementById('learner' + this.learnerList[i].id) as HTMLInputElement;

      if (event.target.checked) {

        this.studentId.push(this.learnerList[i].id);
        // student.checked = true;
        this.learnerList[i].selected = true;

      } else {

        this.studentId = [];
        // student.checked = false;
        this.learnerList[i].selected = false;

      }
    }
    
  }

  submitButtonClick() {

    if (this.branchId == undefined) {

      this.snotify.body = 'Please select branch.';
      this.snotify.onError();

    } else if (this.type == undefined) {

      this.snotify.body = 'Please select course type.';
      this.snotify.onError();

    } else if (this.course == undefined) {

      this.snotify.body = 'Please select course.';
      this.snotify.onError();

    } else if (this.amount == '') {

      this.snotify.body = 'Please enter amount.';
      this.snotify.onError();

    } else if (this.studentId.length == 0) {

      this.snotify.body = 'Please select Students.';
      this.snotify.onError();

    } else {

      const purchaseData: { [k: string]: any } = {

        type: this.type,
        id: this.course,
        amount: this.amount,
        paymentGateWayId: this.paymentGateWayId,
        currencyId: this.currencyId,

        studentId: this.studentId.toString()
      };

      this.serviceFees.addPurchase(purchaseData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.branchId = undefined;

        this.cancelEditClick();

      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();
        });

    }
  }

}
