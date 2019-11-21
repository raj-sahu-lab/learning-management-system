import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';
import { HttpClient } from '@angular/common/http';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { appApiResources } from './../../../RestApiCall/ApiHelper/app.constants';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-learner',
  providers: [LearnerApiHelper, BranchApiHelper],
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.scss']
})
export class LearnerComponent implements OnInit {

  selectedDescription: any;

  filter = false;
  countryList: any;

  isEdit = false;
  educationList = [];
  learnerList = [];
  learnerListExcel: any;

  branchList = [];
  branchId = undefined;

  educationType = undefined;
  firstName = '';
  lastName = '';
  countryCode = undefined;
  phone = '';
  email = '';
  password = '';

  learnerId = null;
  editIndex = null;

  selectedExcel: any;
  excelFile = '';

  columBranch = false;
  columFirstName = true;
  columLastName = true;
  columPhone = true;
  columEmail = true;
  columStatus = true;

  isActive = null;

  loggedIn : any;
  public userType: number;

  constructor(public router: Router, public httpURL: HttpClient, protected serviceBranch: BranchApiHelper, protected serviceLearner: LearnerApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;

    this.learners();
    this.branches();
    this.education();
    this.countryCity();
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  learners() {

    this.serviceLearner.getLearnerList('0').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.learnerList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  branches() {
    this.serviceBranch.getBranchList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.branchList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  education() {
    const allEducation = appApiResources.education;

    this.httpURL.get(allEducation).subscribe((res: ServerResponse) => {

      this.educationList = res.data;

    },
      (err) => {

        console.log(err);
      });
  }

  countryCity() {

    const allCountry = appApiResources.countryCityList;

    this.httpURL.get(allCountry).subscribe((res: ServerResponse) => {

      this.countryList = res.data;

    },
      (err) => {

        console.log(err);
      });
  }

  validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

  submitButtonClick() {

    if (this.branchId == undefined && this.userType !== 3) {

      this.snotify.body = 'Please select branch.';
      this.snotify.onError();

    } else if (this.firstName == '') {

      this.snotify.body = 'Please enter first name.';
      this.snotify.onError();

    } else if (this.firstName.length < 2 || this.firstName.length > 25) {

      this.snotify.body = 'Please enter first name between 2 to 25 characters.';
      this.snotify.onError();

    } else if (this.countryCode == undefined) {

      this.snotify.body = 'Please country code.';
      this.snotify.onError();

    } else if (this.phone == '') {

      this.snotify.body = 'Please enter number.';
      this.snotify.onError();

    } else if (this.phone.toString().length < 5 || this.phone.toString().length > 10) {

      this.snotify.body = 'Please enter valid number.';
      this.snotify.onError();

    } else if (!this.validateEmail(this.email) && this.email !== '') {

      this.snotify.body = 'Please enter valid email.';
      this.snotify.onError();

    } else if (this.learnerId == null && this.password == '') {

      this.snotify.body = 'Please enter password.';
      this.snotify.onError();

    } else if (this.learnerId == null && (this.password.length < 6 || this.password.length > 16)) {

      this.snotify.body = 'Please enter password between 6 to 16 characters.';
      this.snotify.onError();

    } else if (this.learnerId == null && this.password.search(/\d/) == -1) {

      this.snotify.body = 'Password must contain number.';
      this.snotify.onError();

    } else if (this.learnerId == null && this.password.search(/[a-zA-Z]/) == -1) {

        this.snotify.body = 'Password must contain letter.';
        this.snotify.onError();

    } else if (this.learnerId == null && this.password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

      this.snotify.body = 'Password must contain special character.';
      this.snotify.onError();

    } else {

      const learnerData: { [k: string]: any } = {

        branchId: this.branchId,
        firstName: this.firstName,
        lastName: this.lastName,
        countryCode: this.countryCode == undefined ? null : this.countryCode,
        phone: this.phone,
        educationType: this.educationType,
        email: this.email,
        password: this.password,
      };

      this.serviceLearner.addLearner(learnerData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {

          this.learnerList.unshift(res.data);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();
        });

    }
  }

  editButtonClick(learnerId) {

    const learner = this.learnerList.find(obj => obj.id == learnerId);

    this.learnerId = learnerId;

    if (learner.instituteList.isActive == 0) {
      this.isActive = 1;

    } else {

      this.isActive = 0;

    }

    const learnerData: { [k: string]: any } = {

      branchId: learner.instituteList.branch.id,
      learnerId: this.learnerId,
      isActive: this.isActive,
    };

    this.serviceLearner.statusLearner(learnerData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      this.learnerList[this.learnerList.findIndex(obj => obj.id == this.learnerId)].instituteList.isActive = this.isActive;
      this.helperService.loadDataTable();

    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

      });
  }

  cancelEditClick() {

    this.isEdit = false;

    this.learnerId = null;

    this.educationType = undefined;
    this.branchId = undefined;
    this.firstName = '';
    this.lastName = '';
    this.countryCode = undefined;
    this.phone = null;
    this.email = '';
    this.password = '';

  }

  selectExcelFile(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedExcel = fileInput.target.files[0];
    }
  }

  submitExcelButtonClick() {

    if (this.selectedExcel == null && this.isEdit == false) {

      this.snotify.body = 'Please select excel file.';
      this.snotify.onError();

    } else {

      this.serviceLearner.addLearnerExcel(this.selectedExcel).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {

          this.learnerListExcel = res.data;
          this.excelFile = null;
          this.selectedExcel = null;
          this.learners();

        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

        });
    }
  }

  showDescription() {

    this.selectedDescription = true;
  }

  hideDescription() {

    this.selectedDescription = null;
    this.learnerListExcel = null;
    this.selectedExcel = '';
  }

}
