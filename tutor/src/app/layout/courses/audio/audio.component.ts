import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { AudioApiHelper } from '../../../RestApiCall/ApiHelper/Audio.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AWSUploadService } from '../../../AWS_Services/awsupload.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
declare var $: any;

@Component({
  selector: 'app-audio',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, AudioApiHelper],
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})

export class AudioComponent implements OnInit {

  filter = false;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  usedSpace = 0;

  audioList = [];
  isEdit = false;
  audioId = null;

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

  audio = '';
  selectedAudio: any;
  selectedAudioFile: any;

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  status = '0';

  audioDuration: any;
  audioUrl: SafeResourceUrl = '';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columAudio = true;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  deleteConfirmation = '';

  constructor(private authApiHelper: AuthApiHelper, protected serviceCurrency: CurrencyApiHelper, private sanitizer: DomSanitizer, public router: Router, public helperService: HelperService, private awsUpload: AWSUploadService, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, protected serviceAudio: AudioApiHelper, public snotify: TostNotificationService) { }

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
      this.audioListGet();

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

  audioListGet() {
    this.serviceAudio.getAudioList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.audioList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  FileChangedAudio(fileInput: any) {

    this.audioDuration = null;
    const that = this;

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedAudioFile = fileInput.target.files[0];

      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = function () {

        window.URL.revokeObjectURL(audio.src);
        that.audioDuration = audio.duration.toFixed(0);

        console.log(audio.duration.toFixed(0));
      };

      audio.src = URL.createObjectURL(fileInput.target.files[0]);
    }
  }

  editButtonClick(audioId) {

    document.getElementById('startForm').scrollIntoView();
    
    const audio = this.audioList.find(obj => obj.id == audioId);

    this.isEdit = true;
    this.audioId = audioId;

    this.subjectId = audio.subject.id;
    this.subjectChanged();

    this.topicId = audio.topic.id;
    this.topicChanged();

    this.contentId = audio.content.id;
    this.contentChange();

    this.selectedAudio = audio.audio;
    this.title = audio.title;

    this.status = audio.status ? audio.status.toString() : '0';

    this.paymentTypeFree = audio.isPaid ? audio.isPaid.toString() : '0';
    this.paymentGateWayId = audio.paymentgateway_id ? audio.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = audio.iosPaymentGateWay.id ? audio.iosPaymentGateWay.id : undefined;
    this.currencyId = audio.currency?.id;
    this.amount = audio.amount;
    this.validity = audio.validity;
    this.previewText = audio.preview;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.audioId = null;

    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;

    this.title = '';

    this.audio = '';
    this.selectedAudio = null;

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';
    this.status = '0';

  }

  deleteButtonClick(audioId) {

    // this.audioId = audioId;

    // if(this.deleteConfirmation == 'delete'){

    //   this.snotify.body = 'You must type delete in text box for delete.';
    //   this.snotify.onError();

    // } else {
    //   console.log("Okay");
    // }

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete audio?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceAudio.deleteAudio(audioId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.audioList.splice(this.audioList.findIndex(obj => obj.id == audioId), 1);
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

  hideDelete() {
    this.audioId = null;
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

      this.snotify.body = 'Please enter audio name.';
      this.snotify.onError();

    } else if (this.selectedAudioFile == null && this.audioId == null) {

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

      const audioData: { [k: string]: any } = {

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
        duration: this.audioDuration,
      };

      const that = this;
      this.helperService.startLoader();

      if (this.isEdit) {

        audioData.audioId = this.audioId;
        audioData.status = this.status;

        if (this.selectedAudioFile == undefined) {

          that.audioEditing(audioData);

        } else {

          this.awsUpload.uploadVideoFile(this.selectedAudioFile).then(function (successRes) {

            audioData['audioUrl'] = successRes.Key;
            that.audioEditing(audioData);

          }, function (error) {

            console.log(error);

          });

        }

      } else {

        this.awsUpload.uploadAudioFile(this.selectedAudioFile).then(function (successRes) {

          audioData['audioUrl'] = successRes.Key;
          that.audioAdding(audioData);

        }, function (error) {

          console.log(error);

        });


      }
    }
  }

  audioAdding(audioData) {
    this.serviceAudio.addAudio(audioData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.audioList.unshift(res.data);
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

  audioEditing(audioData) {

    this.serviceAudio.updateAudio(audioData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.audioList[this.audioList.findIndex(obj => obj.id == this.audioId)] = res.data;
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

  showPreview(audioId) {

    this.selectedPreview = this.audioList.find(obj => obj.id == audioId);

  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(audioId) {

    this.selectedDescription = this.audioList.find(obj => obj.id == audioId);
    this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDescription.url);
  }

  hideDescription() {

    const urlAudio = $('#audioUrl').attr('src');
    $('#audioUrl').attr('src', '');
    $('#audioUrl').attr('src', urlAudio);

    this.selectedDescription = null;
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

}
