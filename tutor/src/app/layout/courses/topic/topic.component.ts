import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { TopicApiHelper } from '../../../RestApiCall/ApiHelper/Topic.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
@Component({
  selector: 'app-topic',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, TopicApiHelper],
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})

export class TopicComponent implements OnInit {

  filter = false;

  usedSpace = 0;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  topicList = [];
  isEdit = false;
  topicId = null;

  subjectList = [];
  subjectId: any;
  subjectIsPaid = false;

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

  columBranch = false;
  columTutor = false;
  columSubject = true;
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

  constructor(private authApiHelper: AuthApiHelper,protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceCurrency: CurrencyApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, protected serviceTopic: TopicApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

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
      this.topicListGet();
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

  topicListGet() {
    this.serviceTopic.getTopicList().subscribe((res: ServerResponse) => {
      if (res.success && res.data != null) {

        this.topicList = res.data;
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

  editButtonClick(topicId) {

    document.getElementById('startForm').scrollIntoView();

    const topic = this.topicList.find(obj => obj.id == topicId);
    this.isEdit = true;
    this.topicId = topic.id;

    this.subjectId = topic.subjectId;
    this.subjectChanged();

    this.title = topic.title;
    this.description = topic.description;

    this.status = topic.status ? topic.status.toString() : '0';
    this.paymentTypeFree = topic.isPaid ? topic.isPaid.toString() : '0';

    this.paymentGateWayId = topic.paymentgateway_id ? topic.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = topic.iosPaymentGateWay.id ? topic.iosPaymentGateWay.id : undefined;

    this.currencyId = topic.currency?.id;
    this.amount = topic.amount;
    this.validity = topic.validity;

    this.previewText = topic.preview;

  }

  cancelEditClick() {

    this.isEdit = false;
    this.topicId = null;

    this.subjectId = undefined;

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

  deleteButtonClick(topicId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete topic?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceTopic.deleteTopic(topicId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.topicList.splice(this.topicList.findIndex(obj => obj.id == topicId), 1);
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

      this.snotify.body = 'Please select subject.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter module name.';
      this.snotify.onError();

    } else if (this.title.length < 2 || this.title.length > 50) {

      this.snotify.body = 'Please enter module name between 2 to 50 characters.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter module description.';
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

      const topic: { [k: string]: any } = {

        subjectId: this.subjectId,
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

        topic.topicId = this.topicId;
        topic.status = this.status;

        this.serviceTopic.updateTopic(topic).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.topicList[this.topicList.findIndex(obj => obj.id == this.topicId)] = res.data;
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

        this.serviceTopic.addTopic(topic).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.topicList.unshift(res.data);
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
        this.paymentTypeFree = '0';

      }
    });

  }

  showPreview(topicId) {

    this.selectedPreview = this.topicList.find(obj => obj.id == topicId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(topicId) {

    this.selectedDescription = this.topicList.find(obj => obj.id == topicId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }
}
