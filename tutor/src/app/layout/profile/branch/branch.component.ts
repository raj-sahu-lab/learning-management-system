import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';

import { appApiResources } from './../../../RestApiCall/ApiHelper/app.constants';

@Component({
  selector: 'app-branch',
  providers: [BranchApiHelper],
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  filter = false;

  countryList: any;
  countryId:undefined;

  cityList :any;
  cityId:undefined;
  
  branchList = [];
  isEdit = false;
  branchId = null;
  editIndex = null;

  branchName = '';
  managerName = '';
  contactCountryCode = undefined;
  contactNumber = '';

  altcontactCountryCode = undefined;
  altContactNumber = '';
  branchEmail = '';
  address = '';
  billingAddress = '';
  panNumber = null;
  gstNumber = null;
  pincode = null;
  latitude = '';
  longitude = '';
  status = '0';

  loggedIn : any;
  public userType: number;

  constructor(public router: Router, public httpURL: HttpClient, protected serviceBranch: BranchApiHelper, public snotify: TostNotificationService) { }

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


    this.countryCity();
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

  countryChanged() {

    this.countryList.forEach(country => {

        if (this.countryId == country.id) {
          
          this.cityList = country.citys;
        }
    });

  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete branch?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceBranch.deleteBranch(this.branchList[index].id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.branchList.splice(index, 1);
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  editButtonClick(index) {

    const branch = this.branchList[index];
    this.isEdit = true;
    this.branchId = branch.id;
    this.editIndex = index;

    this.branchName = branch.name;
    this.managerName = branch.manager;
    this.contactCountryCode = branch.contactCountryCode != "" ? branch.contactCountryCode : undefined;
    this.contactNumber = branch.number;
    this.altcontactCountryCode = branch.altcontactCountryCode;
    this.branchEmail = branch.email;
    this.countryId = branch.city.country.id;
    this.countryChanged();
    this.cityId = branch.city.id;
    this.altContactNumber = branch.altNumber;
    this.address = branch.address;
    this.panNumber = branch.panNumber;
    this.gstNumber = branch.gstNumber;
    this.pincode = branch.pincode;
    this.billingAddress = branch.billingAddress;
    this.latitude = branch.latitude;
    this.longitude = branch.longitude;
    this.status = branch.status ? branch.status.toString() : '0';

  }

  cancelEditClick() {

    this.isEdit = false;
    this.branchId = null;
    this.editIndex = null;

    this.branchName = '';
    this.managerName = '';
    this.contactCountryCode = undefined;
    this.contactNumber = '';
    this.altcontactCountryCode = undefined;
    this.altContactNumber = '';
    this.branchEmail = '';
    this.countryId = undefined;
    this.cityId = undefined;
    this.address = '';
    this.panNumber = null;
    this.gstNumber = null;
    this.pincode = null;
    this.billingAddress = '';
    this.latitude = '';
    this.longitude = '';
  }

  submitButtonClick() {

    //console.log(this.panNumber);

    if (this.branchName == '') {

      this.snotify.body = 'Please enter branch name.';
      this.snotify.onError();

    } else if (this.branchEmail == '') {

      this.snotify.body = 'Please enter branch email.';
      this.snotify.onError();

    } else {

      const branchData: {[k: string]: any} = {

        branchName: this.branchName,
        managerName: this.managerName,
        contactCountryCode: this.contactCountryCode == undefined ? '' : this.contactCountryCode,
        contactNumber: this.contactNumber,
        altcontactCountryCode: this.altcontactCountryCode == undefined ? '' : this.altcontactCountryCode,
        altContactNumber: this.altContactNumber,
        branchEmail: this.branchEmail,
        countryId: this.countryId,
        cityId: this.cityId,
        address: this.address,
        panNumber: this.panNumber,
        gstNumber: this.gstNumber,
        pincode: this.pincode,
        billingAddress: this.billingAddress,
        latitude: '',
        longitude: '',
      };
      
      if (this.isEdit) {

        branchData.branchId = this.branchId;
        branchData.status = this.status;

        this.serviceBranch.updateBranch(branchData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.branchList[this.editIndex] = res.data;
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceBranch.addBranch(branchData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.branchList.unshift(res.data);
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

  communicationAsBillingClick() {
    this.billingAddress = this.address;
  }
}
