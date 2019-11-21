import { Component, OnInit } from '@angular/core';
import { TutorApiHelper } from '../../../RestApiCall/ApiHelper/Tutor.service';

import { HttpClient } from '@angular/common/http';
import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { appApiResources } from './../../../RestApiCall/ApiHelper/app.constants';
declare var $: any;
import { NgxImageCompressService} from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import { BaseService } from '../../../RestApiCall/NetworkLayer/base.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';

@Component({
  selector: 'app-tutor',
  providers: [TutorApiHelper, BranchApiHelper],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit{

  filter = false;

  countryList: any;

  tutorList = [];
  tutorId = null;
  isEdit = false;

  gender: string;
  branchList = [];
  branchId = undefined;

  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  image = '';
  selectedTutorImage: any;
  selectedTutorFile: any;

  name = '';
  countryCode = undefined;
  contactnumber = '';
  email = '';
  qualification = '';
  experience = '';
  password = '';
  bio = '';

  status = '0';

  columImage = true;
  columBranch = false;
  columGender = true;
  columName = true;
  columNumber = true;
  columEmail = true;
  columQualification = false;
  columExperience = false;
  columStatus = true;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper,public baseService: BaseService,public httpURL: HttpClient, protected serviceTutor: TutorApiHelper, protected serviceBranch: BranchApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  
  ngOnInit() {
    
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;

      this.tutorListGet();
      this.branchListGet();
      this.countryCity();

    } catch (error) {
      this.authApiHelper.tryCatchFail(); 
      console.log(error);
    }
  }

  tutorListGet(){
    this.serviceTutor.getTutorList('0').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.tutorList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  branchListGet(){
    this.serviceBranch.getBranchList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.branchList = res.data;
      }
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

  dropDownFilter() {

    this.filter = !this.filter;
  }

  tutorFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);

        this.selectedTutorImage = e.target['result'];
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  compressImage(image, fileName) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);
        // imageFile created below is the new compressed file which can be send to API in form data
        this.selectedTutorFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
        this.imageSize = Math.round(this.selectedTutorFile.size / 1024);
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

  editButtonClick(tutorId) {

    document.getElementById('startForm').scrollIntoView();

    const tutor = this.tutorList.find(obj => obj.id == tutorId);
    
    this.isEdit = true;
    this.tutorId = tutorId;
    this.selectedTutorImage = tutor.image;
    this.gender = tutor.gender;
    this.branchId = tutor.branch.id;
    this.name = tutor.name;

    if(tutor.countryCode) {
      this.countryCode = tutor.countryCode.toString();
    }
    
    this.contactnumber = tutor.phone;
    this.email = tutor.email;
    this.qualification = tutor.qualification;
    this.experience = tutor.experience;
    this.password = tutor.password;
    this.bio = tutor.bio;
    this.status = tutor.status ? tutor.status.toString() : '0';
  }

  cancelEditClick() {

    this.isEdit = false;
    this.tutorId = null;

    this.image = '';
    this.selectedTutorImage = null;
    this.selectedTutorFile = null;

    this.name = '';
    this.countryCode = undefined;
    this.contactnumber = '';
    
    this.gender = undefined;
    this.email = '';
    this.qualification = '';
    this.experience = '';
    this.password = '';
    this.bio = '';
    this.status = '0';
  }

  deleteButtonClick(tutorId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete tutor?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceTutor.deleteTutor(tutorId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.tutorList.splice(this.tutorList.findIndex(obj => obj.id == tutorId), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();
        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  submitButtonClick() {

    if (this.tutorList.length > 1 && this.userPurchasePlan == 7) {

      this.snotify.body = 'You can not create more than 1 educator in a free trial.';
      this.snotify.onError();

    } else if (this.tutorList.length > 1 && (this.userPurchasePlan == 1 || this.userPurchasePlan == 6)) {

      this.snotify.body = 'You can not create more than 1 educator in a basic plan.';
      this.snotify.onError();

    } else if (this.tutorList.length > 10 && (this.userPurchasePlan == 2 || this.userPurchasePlan == 4)) {

      this.snotify.body = 'You can not create more than 10 educator in a premium plan.';
      this.snotify.onError();

    } else if (this.tutorList.length > 25 && (this.userPurchasePlan == 3 || this.userPurchasePlan == 5)) {

      this.snotify.body = 'You can not create more than 25 educator in a ultimate plan.';
      this.snotify.onError();

    } else if (this.branchId == undefined) {

      this.snotify.body = 'Please select branch.';
      this.snotify.onError();

    } else if (this.name == '') {

      this.snotify.body = 'Please enter educator name.';
      this.snotify.onError();

    } else if (this.name.length < 2 || this.name.length > 25) {

      this.snotify.body = 'Please enter educator name between 2 to 25 characters.';
      this.snotify.onError();

    } else if (this.email == '') {

      this.snotify.body = 'Please enter an email.';
      this.snotify.onError();

    } else if (!this.validateEmail(this.email)) {

      this.snotify.body = 'Please enter valid email.';
      this.snotify.onError();

    } else if (this.password == '') {

      this.snotify.body = 'Please enter password.';
      this.snotify.onError();

    } else if (this.tutorId == null && (this.password.length < 6 || this.password.length > 16)) {

      this.snotify.body = 'Please enter password between 6 to 16 characters.';
      this.snotify.onError();

    } else if (this.tutorId == null && this.password.search(/\d/) == -1) {

      this.snotify.body = 'Password must contain number.';
      this.snotify.onError();

    } else if (this.tutorId == null && this.password.search(/[a-zA-Z]/) == -1) {

        this.snotify.body = 'Password must contain letter.';
        this.snotify.onError();

    } else if (this.tutorId == null && this.password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

      this.snotify.body = 'Password must contain special character.';
      this.snotify.onError();

    } else {

      const tutor: { [k: string]: any } = {

        branchId: this.branchId,
        name: this.name,
        countryCode: this.countryCode == undefined ? '' : this.countryCode,
        phone: this.contactnumber,
        gender: this.gender,
        email: this.email,
        qualification: this.qualification,
        experience: this.experience,
        password: this.password,
        bio: this.bio,
      };
      
      if (this.isEdit) {

        tutor.tutorId = this.tutorId;
        tutor.status = this.status;

        this.serviceTutor.updateTutor(this.selectedTutorFile, tutor).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.tutorList[this.tutorList.findIndex(obj => obj.id == this.tutorId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceTutor.addTutor(this.selectedTutorFile, tutor).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.tutorList.unshift(res.data);
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
  }

}
