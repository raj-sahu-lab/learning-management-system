import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { TutorApiHelper } from '../../../RestApiCall/ApiHelper/Tutor.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { NgxImageCompressService } from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
@Component({
  selector: 'app-subject',
  providers: [PaymentgatewayApiHelper, TutorApiHelper, SubjectApiHelper],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})

export class SubjectComponent implements OnInit {

  filter = false;

  usedSpace = 0;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  subjectList = [];
  isEdit = false;
  subjectId = null;

  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  image = '';
  selectedSubjectImage: any;
  selectedSubjectFile: any;

  tutorList = [];
  tutorId = null;
  tutor: any;

  title = '';
  description = '';

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  status = '0';

  columImage = true;
  columBranch = false;
  columTutor = false;
  columName = true;
  columDescription = false;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper, public router: Router, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceTutor: TutorApiHelper, protected serviceCurrency: CurrencyApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  ngOnInit() {

    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;
      this.currencyId = User.currency_id;

      if (this.userType !== 1) {

        // Institute Login
        this.router.navigate(['/not-found']);
      }

      this.currencyGet();
      this.usedSpaceGet();
      this.paymentGateWayListGet();
      this.tutorListGet();
      this.subjectListGet();

    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }
  }

  currencyGet() {
    this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.currencyList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  usedSpaceGet() {
    this.serviceSpace.getUsedSpace().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.usedSpace = res.data.usedSpace;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  paymentGateWayListGet() {
    this.servicePaymentGateWay.getPaymentGateWayList().subscribe((res: ServerResponse) => {
      if (res != null && res.success && res.data != null) {

        this.paymentGateWayList = res.data.gateWay;
        this.iOSInAppList = res.data.iOSInApp;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  tutorListGet() {
    this.serviceTutor.getTutorList('0').subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.tutorList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  subjectListGet() {
    this.serviceSubject.getSubjectList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }
  dropDownFilter() {

    this.filter = !this.filter;
  }

  subjectFileChanged(fileInput: any) {
    let fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);

        this.selectedSubjectImage = e.target['result'];
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
      this.selectedSubjectFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
      this.imageSize = Math.round(this.selectedSubjectFile.size / 1024);
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

  editButtonClick(subjectId) {

    document.getElementById('startForm').scrollIntoView();

    const subject = this.subjectList.find(obj => obj.id == subjectId);
    this.isEdit = true;
    this.subjectId = subjectId;

    this.selectedSubjectImage = subject.image;

    this.tutor = subject.tutor.id;

    this.title = subject.title;
    this.description = subject.description;
    this.status = subject.status ? subject.status.toString() : '0';
    this.paymentTypeFree = subject.isPaid ? subject.isPaid.toString() : '0';
    this.paymentGateWayId = subject.paymentgateway_id ? subject.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = subject.iosPaymentGateWay.id ? subject.iosPaymentGateWay.id : undefined;
    this.currencyId = subject.currency?.id;
    this.amount = subject.amount;
    this.validity = subject.validity;
    this.previewText = subject.preview;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.subjectId = null;

    this.image = '';
    this.selectedSubjectImage = null;
    this.selectedSubjectFile = null;

    this.tutor = undefined;

    this.title = '';
    this.description = '';
    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';
    this.status = '0';

  }

  deleteButtonClick(subjectId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete subject?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSubject.deleteSubjct(subjectId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.subjectList.splice(this.subjectList.findIndex(obj => obj.id == subjectId), 1);
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

    if (this.userPurchasePlan == 7 && this.usedSpace > 2) {

      this.snotify.body = 'You can not upload more than 2 GB video in a free trial.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 1 || this.userPurchasePlan == 6) && this.usedSpace > 25) {

      this.snotify.body = 'You can not upload more than 25 GB video in a basic plan.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 2 || this.userPurchasePlan == 4) && this.usedSpace > 500) {

      this.snotify.body = 'You can not upload more than 500 GB video in a premium plan.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 3 || this.userPurchasePlan == 5) && this.usedSpace > 1024) {

      this.snotify.body = 'You can not upload more than 1024 GB video in a ultimate plan.';
      this.snotify.onError();

    } else if (this.selectedSubjectImage == null && this.isEdit == false) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

      // else if (this.imageSize >= 500 && this.selectedSubjectFile != undefined) {

      //   this.snotify.body = 'The image size maximum allowed 500 Kb';
      //   this.snotify.onError();

      // } else if (this.imageWidth != 945 && this.imageHeight != 615 && this.selectedSubjectFile != undefined) {

      //   this.snotify.body = 'The image size must be 945 x 615 px.';
      //   this.snotify.onError();

      // }

    } else if (this.tutor == null) {

      this.snotify.body = 'Please select educator.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter course bundle name.';
      this.snotify.onError();

    } else if (this.title.length < 2 || this.title.length > 50) {

      this.snotify.body = 'Please enter course bundle name between 2 to 50 characters.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter bundle description.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.paymentGateWayId == undefined) {

      this.snotify.body = 'Please select payment gateway.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.iosPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select iOS payment gateway.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && (this.amount == null || this.amount == 0)) {

      this.snotify.body = 'Please enter amount.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && (this.validity == null || this.validity == 0)) {

      this.snotify.body = 'Please enter validity.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.validity >= 365) {

      this.snotify.body = 'Please enter validity less than 365 days.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.previewText == '') {

      this.snotify.body = 'Please enter preview.';
      this.snotify.onError();

    } else {

      const subject: { [k: string]: any } = {

        tutorId: this.tutor,
        title: this.title,
        description: this.description,
        isPaid: this.paymentTypeFree,
        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : null,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : null,
        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        validity: this.paymentTypeFree == '1' ? this.validity : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null
      };

      if (this.isEdit) {

        subject.subjectId = this.subjectId;
        subject.status = this.status;

        this.serviceSubject.updateSubjct(this.selectedSubjectFile, subject).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.subjectList[this.subjectList.findIndex(obj => obj.id == this.subjectId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceSubject.addSubjct(this.selectedSubjectFile, subject).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.subjectList.unshift(res.data);
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

  showPreview(subjectId) {

    this.selectedPreview = this.subjectList.find(obj => obj.id == subjectId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(subjectId) {

    this.selectedDescription = this.subjectList.find(obj => obj.id == subjectId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
