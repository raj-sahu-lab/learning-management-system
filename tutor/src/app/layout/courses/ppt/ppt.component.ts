import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { PptApiHelper } from '../../../RestApiCall/ApiHelper/Ppt.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
declare var $: any;

@Component({
  selector: 'app-ppt',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, PptApiHelper],
  templateUrl: './ppt.component.html',
  styleUrls: ['./ppt.component.scss']
})
export class PptComponent implements OnInit {

  filter = false;

  usedSpace = 0;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  pptList = [];
  isEdit = false;
  pptId = null;

  subjectList = [];
  subjectId: any;
  subjectIsPaid = false;

  topicsList: any[] = [];
  topicId: any;
  topicIsPaid = false;

  contentList: any[] = [];
  contentId: any;
  contentIsPaid = false;

  title = '';

  ppt = '';
  selectedPpt: any;
  selectedPptFile: any;

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  status = '0';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columPpt = true;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper, protected serviceCurrency: CurrencyApiHelper, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, protected servicePpt: PptApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;
      this.currencyId = User.currency_id;

      this.currencyGet();
      this.usedSpaceGet();
      this.paymentGateWayListGet();
      this.subjectAndTopicListGet();
      this.pptListGet();
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

  subjectAndTopicListGet() {
    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  pptListGet() {

    this.servicePpt.getPptList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.pptList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  FileChangedPpt(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedPptFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedPpt = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  editButtonClick(pptId) {

    document.getElementById('startForm').scrollIntoView();
    const ppt = this.pptList.find(obj => obj.id == pptId);

    this.isEdit = true;
    this.pptId = pptId;

    this.subjectId = ppt.subject.id;
    this.subjectChanged();

    this.topicId = ppt.topic.id;
    this.topicChanged();

    this.contentId = ppt.content.id;
    this.contentChange();

    this.selectedPpt = ppt.ppt;
    this.title = ppt.title;

    this.status = ppt.status ? ppt.status.toString() : '0';
    this.paymentTypeFree = ppt.isPaid ? ppt.isPaid.toString() : '0';
    this.paymentGateWayId = ppt.paymentgateway_id ? ppt.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = ppt.iosPaymentGateWay.id ? ppt.iosPaymentGateWay.id : undefined;

    this.currencyId = ppt.currency?.id;
    this.amount = ppt.amount;
    this.validity = ppt.validity;
    this.previewText = ppt.preview;

  }

  cancelEditClick() {

    this.isEdit = false;
    this.pptId = null;

    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;

    this.title = '';

    this.ppt = '';
    this.selectedPpt = null;

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';
    this.status = '0';

  }

  deleteButtonClick(pptId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete ppt?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePpt.deletePpt(pptId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.pptList.splice(this.pptList.findIndex(obj => obj.id == pptId), 1);
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

    } else if (this.subjectId == null) {

      this.snotify.body = 'Please select course bundle.';
      this.snotify.onError();

    } else if (this.topicId == null) {

      this.snotify.body = 'Please select module.';
      this.snotify.onError();

    } else if (this.contentId == null) {

      this.snotify.body = 'Please select lecture content.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter PPT name.';
      this.snotify.onError();

    } else if (this.selectedPptFile == null && this.pptId == null) {

      this.snotify.body = 'Please select file.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.paymentGateWayId == undefined) {

      this.snotify.body = 'Please select payment gateway.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.iosPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select iOS payment.';
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

      const pptData: { [k: string]: any } = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        contentId: this.contentId,

        isPaid: this.paymentTypeFree,

        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : null,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : null,

        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        validity: this.paymentTypeFree == '1' ? this.validity : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null,
        title: this.title,
      };

      if (this.isEdit) {

        pptData.pptId = this.pptId;
        pptData.status = this.status;

        this.servicePpt.updatePpt(this.selectedPptFile, pptData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.pptList[this.pptList.findIndex(obj => obj.id == this.pptId)] = res.data;
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

        this.servicePpt.addPpt(this.selectedPptFile, pptData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.pptList.unshift(res.data);
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

  subjectChanged() {

    this.subjectList.forEach(subject => {

      if (this.subjectId == subject.id) {
        this.subjectIsPaid = subject.isPaid;
        this.topicsList = subject.topics;

        this.paymentTypeFree = '0';
      }
    });

    this.topicChanged();
    this.topicId = undefined;

    this.contentList = [];
    this.contentId = undefined;

    this.topicIsPaid = false;
    this.contentIsPaid = false;
  }

  topicChanged() {

    this.topicsList.forEach(topic => {

      if (this.topicId == topic.id) {

        this.topicIsPaid = topic.isPaid;
        this.contentList = topic.contents;

        this.paymentTypeFree = '0';
      }
    });

    this.contentChange();
    this.contentId = undefined;
    this.contentIsPaid = false;
  }

  contentChange() {

    this.contentList.forEach(content => {

      if (this.contentId == content.id) {

        this.contentIsPaid = content.isPaid;

        this.paymentTypeFree = '0';
      }
    });

  }

  showPreview(pptId) {

    this.selectedPreview = this.pptList.find(obj => obj.id == pptId);

  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(pptId) {

    this.selectedDescription = this.pptList.find(obj => obj.id == pptId);

  }

  hideDescription() {

    this.selectedDescription = null;
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }
}
