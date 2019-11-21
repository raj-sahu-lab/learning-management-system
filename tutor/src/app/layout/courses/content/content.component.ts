import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { ContentApiHelper } from '../../../RestApiCall/ApiHelper/Content.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { VideoApiHelper } from '../../../RestApiCall/ApiHelper/Video.service';
import { AWSUploadService } from '../../../AWS_Services/awsupload.service';

import { HttpClient } from '@angular/common/http';

import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { environment } from '../../../../environments/environment';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
declare var $: any;

@Component({
  selector: 'app-content',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, ContentApiHelper, VideoApiHelper],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  importLiveClass: boolean;
  filter = false;

  usedSpace = 0;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  contentList = [];
  isEdit = false;
  contentId = null;

  subjectList = [];
  subjectId: any;
  subjectIsPaid = false;

  topicsList: any[] = [];
  topicId: any;
  topicIsPaid = false;

  test = '1';
  practice = '0';

  paymentTypeFree = '0';

  paymentGateWayList = [];
  iOSInAppList = [];
  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;

  amount = 0;
  validity = 0;
  previewText = '';

  title = '';
  public Editor = ClassicEditor;
  description = '';

  contentPDF = false; // Checkbox
  titlePDF = '';
  PDF = '';
  downloadable = '0';
  paymentTypeFreePDF = '0';
  pdfPaymentGateWayId = undefined;
  iosPDFPaymentGateWayid = undefined;
  currencyIdPDF = undefined;
  amountPDF = 0;
  validityPDF = 0;
  previewTextPDF = '';
  selectedPDF: any;
  selectedPDFFile: any;

  contentPPT = false; // Checkbox
  titlePPT = '';
  PPT = '';
  paymentTypeFreePPT = '0';
  pptPaymentGateWayId = undefined;
  iosPPTPaymentGateWayid = undefined;
  currencyIdPPT = undefined;
  amountPPT = 0;
  validityPPT = 0;
  previewTextPPT = '';
  selectedPPT: any;
  selectedPPTFile: any;

  contentAudio = false; // Checkbox
  titleAudio = '';
  Audio = '';
  paymentTypeFreeAudio = '0';
  audioPaymentGateWayId = undefined;
  iosAudioPaymentGateWayid = undefined;
  currencyIdAudio = undefined;
  amountAudio = 0;
  validityAudio = 0;
  previewTextAudio = '';
  selectedAudio: any;
  selectedAudioFile: any;
  audioDuration: any;

  contentVideo = false; // Checkbox
  titleVideo = '';
  Video = '';
  paymentTypeFreeVideo = '0';
  videoPaymentGateWayId = undefined;
  iosVideoPaymentGateWayid = undefined;
  currencyIdVideo = undefined;
  amountVideo = 0;
  validityVideo = 0;
  previewTextVideo = '';
  videoStreamType = '0'; // File type management
  videourl: '';
  selectedVideo: any;
  selectedVideoFile: any;
  videoDuration: any;
  urlDuration = null;
  videoWidth = null;
  videoHeight = null;

  status = '0';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columTitle = true;
  columDescription = false;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper, protected serviceCurrency: CurrencyApiHelper, protected serviceVideo: VideoApiHelper, public httpURL: HttpClient, public helperService: HelperService, private awsUpload: AWSUploadService, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, protected serviceContent: ContentApiHelper, public snotify: TostNotificationService) { }

  ngOnInit() {
    try {
      this.importLiveClass = environment.importLiveClass;

      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;
      this.currencyId = User.currency_id;

      this.currencyIdPDF = User.currency_id;
      this.currencyIdPPT = User.currency_id;
      this.currencyIdAudio = User.currency_id;
      this.currencyIdVideo = User.currency_id;

      $(document).ready(function () {
        $('#summernote').summernote();
        // $('.dropdown-toggle').dropdown();
      });

      $(document).on('click', function (event) {
        const $trigger = $('.dropdown');
        if ($trigger !== event.target && !$trigger.has(event.target).length) {
          $('.dropdown-menu').removeClass('show');
        }
      });

      this.currencyGet();
      this.usedSpaceGet();
      this.paymentGateWayListGet();
      this.subjectAndTopicListGet();
      this.contentListGet();
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

  contentListGet() {
    this.serviceContent.getContentList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.contentList = res.data;
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

  FileChangedPDF(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedPDFFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedPDF = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  FileChangedPPT(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedPPTFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedPPT = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  FileChangedAudio(fileInput: any) {

    const that = this;
    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedAudioFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e: any) => {

        const aud: any = new Audio(e.target['result']);
        aud.onloadedmetadata = function () {

          that.audioDuration = aud.duration.toFixed(0);

        };

        this.selectedAudio = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  FileChangedVideo(fileInput: any) {

    const that = this;

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedVideoFile = fileInput.target.files[0];

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function (e) {

        that.videoWidth = video.videoWidth;
        that.videoHeight = video.videoHeight;

        window.URL.revokeObjectURL(video.src);
        that.videoDuration = video.duration.toFixed(0);

        // console.log(video.duration.toFixed(0));
      };

      video.src = URL.createObjectURL(fileInput.target.files[0]);
    }
  }

  editButtonClick(contentId) {

    document.getElementById('startForm').scrollIntoView();

    const content = this.contentList.find(obj => obj.id == contentId);

    this.isEdit = true;
    this.contentId = contentId;

    this.subjectId = content.subject.id;
    this.subjectChanged();

    this.topicId = content.topic.id;
    this.topicChanged();

    this.title = content.title;
    this.description = content.description;
    $('#summernote').summernote('code', content.description);

    this.status = content.status ? content.status.toString() : '0';
    this.paymentTypeFree = content.isPaid ? content.isPaid.toString() : '0';
    this.paymentGateWayId = content.payment_type ? content.payment_type.id : undefined;
    this.iosPaymentGateWayid = content.iosPaymentGateWay.id ? content.iosPaymentGateWay.id : undefined;
    this.currencyId = content.currency?.id;
    this.amount = content.amount;
    this.validity = content.validity;
    this.previewText = content.preview;

    this.test = content.isTest.toString();
    this.practice = content.isPractice.toString();
  }

  cancelEditClick() {

    this.isEdit = false;
    this.contentId = null;

    this.subjectId = undefined;
    this.topicId = undefined;

    this.test = '1';
    this.practice = '0';

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';

    this.title = '';
    this.description = '';
    $('#summernote').summernote('reset');

    this.contentPDF = false; // Checkbox
    this.titlePDF = '';
    this.PDF = '';
    this.selectedPDF = null;
    this.selectedPDFFile = null;
    this.downloadable = '0';
    this.paymentTypeFreePDF = '0';
    this.pdfPaymentGateWayId = undefined;
    this.iosPDFPaymentGateWayid = undefined;
    this.currencyIdPDF = this.currencyId;
    this.amountPDF = 0;
    this.previewTextPDF = '';

    this.contentPPT = false; // Checkbox
    this.titlePPT = '';
    this.PPT = '';
    this.selectedPPT = null;
    this.selectedPPTFile = null;
    this.paymentTypeFreePPT = '0';
    this.pptPaymentGateWayId = undefined;
    this.iosPPTPaymentGateWayid = undefined;
    this.currencyIdPPT = this.currencyId;
    this.amountPPT = 0;
    this.previewTextPPT = '';

    this.contentAudio = false; // Checkbox
    this.titleAudio = '';
    this.Audio = '';
    this.selectedAudio = null;
    this.selectedAudioFile = null;
    this.paymentTypeFreeAudio = '0';
    this.audioPaymentGateWayId = undefined;
    this.iosAudioPaymentGateWayid = undefined;
    this.currencyIdAudio = this.currencyId;
    this.amountAudio = 0;
    this.previewTextAudio = '';

    this.urlDuration = null;

    this.contentVideo = false; // Checkbox
    this.titleVideo = '';
    this.Video = '';
    this.videourl = '';
    this.selectedVideo = null;
    this.selectedVideoFile = null;
    this.paymentTypeFreeVideo = '0';
    this.videoPaymentGateWayId = undefined;
    this.iosVideoPaymentGateWayid = undefined;
    this.currencyIdVideo = this.currencyId;
    this.amountVideo = 0;
    this.previewTextVideo = '';

    this.status = '0';

  }

  deleteButtonClick(contentId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete content?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceContent.deleteContent(contentId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.contentList.splice(this.contentList.findIndex(obj => obj.id == contentId), 1);
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

  getUrlDuration() {

    const that = this;

    if (this.videoStreamType == '1') {

      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = this.videourl.match(regExp);
      const youtubeId = match[7].length == 11 ? match[7] : 'wrong';

      const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + youtubeId + '&part=contentDetails&key=YOUR_YOUTUBE_API_KEY';

      this.httpURL.get(url).subscribe((res: any) => {

        const youtubeVideo = res.items[0].contentDetails;

        that.urlDuration = this.convert_time(youtubeVideo.duration);

      });

    } else if (this.videoStreamType == '2') {

      const vimeoID = this.videourl.split('https://vimeo.com/')[1];

      this.serviceVideo.getVimeoDuration(vimeoID).subscribe(function (res) {

        that.urlDuration = res.duration;

      }, function (error) {

        console.log(error);

      });
    }

  }

  convert_time(duration) {

    let a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
      a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
      a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
      a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
      duration = duration + parseInt(a[0]) * 3600;
      duration = duration + parseInt(a[1]) * 60;
      duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
      duration = duration + parseInt(a[0]) * 60;
      duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
      duration = duration + parseInt(a[0]);
    }
    return duration;
  }

  submitButtonClick() {

    this.description = $('#summernote').summernote('code');
    // console.log($('#summernote').summernote('code'));

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

    } else if (this.title == '') {

      this.snotify.body = 'Please enter lecture content header.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter lecture content description.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.previewText == '') {

      this.snotify.body = 'Please enter preview.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.titlePDF == '') {

      this.snotify.body = 'Please enter PDF name.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.selectedPDFFile == null) {

      this.snotify.body = 'Please select PDF file.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && this.pdfPaymentGateWayId == undefined) {

      this.snotify.body = 'Please select PDF payment gateway.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && this.iosPDFPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select PDF iOS payment.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && this.currencyIdPDF == undefined) {

      this.snotify.body = 'Please select PDF currency.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && (this.amountPDF == null || this.amountPDF == 0)) {

      this.snotify.body = 'Please enter PDF amount.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && (this.validityPDF == null || this.validityPDF == 0)) {

      this.snotify.body = 'Please enter PDF validity.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && this.validityPDF >= 365) {

      this.snotify.body = 'Please enter PDF validity less than 365 days.';
      this.snotify.onError();

    } else if (this.contentPDF == true && this.paymentTypeFreePDF == '1' && this.previewTextPDF == '') {

      this.snotify.body = 'Please enter PDF preview.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.titlePPT == '') {

      this.snotify.body = 'Please enter ppt name.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.selectedPPTFile == null) {

      this.snotify.body = 'Please select ppt file.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && this.pptPaymentGateWayId == undefined) {

      this.snotify.body = 'Please select ppt payment gateway.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && this.iosPPTPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select ppt iOS payment.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && this.currencyIdPPT == undefined) {

      this.snotify.body = 'Please select PPT currency.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && (this.amountPPT == null || this.amountPPT == 0)) {

      this.snotify.body = 'Please enter ppt amount.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && (this.validityPPT == null || this.validityPPT == 0)) {

      this.snotify.body = 'Please enter PPT validity.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && this.validityPPT >= 365) {

      this.snotify.body = 'Please enter PPT validity less than 365 days.';
      this.snotify.onError();

    } else if (this.contentPPT == true && this.paymentTypeFreePPT == '1' && this.previewTextPPT == '') {

      this.snotify.body = 'Please enter ppt preview.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.titleAudio == '') {

      this.snotify.body = 'Please enter audio name.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.selectedAudioFile == null) {

      this.snotify.body = 'Please select audio file.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && this.audioPaymentGateWayId == undefined) {

      this.snotify.body = 'Please select audio payment gateway.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && this.iosAudioPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select audio iOS payment.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && this.currencyIdAudio == undefined) {

      this.snotify.body = 'Please select audio currency.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && (this.amountAudio == null || this.amountAudio == 0)) {

      this.snotify.body = 'Please enter audio amount.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && (this.validityAudio == null || this.validityAudio == 0)) {

      this.snotify.body = 'Please enter audio validity.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && this.validityAudio >= 365) {

      this.snotify.body = 'Please enter audio validity less than 365 days.';
      this.snotify.onError();

    } else if (this.contentAudio == true && this.paymentTypeFreeAudio == '1' && this.previewTextAudio == '') {

      this.snotify.body = 'Please enter audio preview.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.titleVideo == '') {

      this.snotify.body = 'Please enter video title.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.videoStreamType == '0' && this.selectedVideoFile == null) {

      this.snotify.body = 'Please select video file.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.videoStreamType !== '0' && this.videourl == null) {

      this.snotify.body = 'Please enter the link.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && this.videoPaymentGateWayId == undefined) {

      this.snotify.body = 'Please select video payment gateway.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && this.iosVideoPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select video iOS payment.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && this.currencyIdVideo == undefined) {

      this.snotify.body = 'Please select video currency.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && (this.amountVideo == null || this.amountVideo == 0)) {

      this.snotify.body = 'Please enter video amount.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && (this.validityVideo == null || this.validityVideo == 0)) {

      this.snotify.body = 'Please enter video validity.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && this.validityVideo >= 365) {

      this.snotify.body = 'Please enter video validity less than 365 days.';
      this.snotify.onError();

    } else if (this.contentVideo == true && this.paymentTypeFreeVideo == '1' && this.previewTextVideo == '') {

      this.snotify.body = 'Please enter video preview.';
      this.snotify.onError();

    } else {

      const that = this;

      const contentData: { [k: string]: any } = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        isAddTest: this.test,
        isAddPractice: this.practice,

        isPaid: this.paymentTypeFree,
        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : null,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : null,
        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        validity: this.paymentTypeFree == '1' ? this.validity : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null,
        title: this.title,
        description: this.description,
      };

      if (this.contentPDF) {

        contentData.pdfTitle = this.titlePDF;
        contentData.downloadable = this.downloadable,
          contentData.pdfIsPaid = this.paymentTypeFreePDF;
        contentData.pdfPaymentGateWayId = this.paymentTypeFreePDF == '1' ? this.pdfPaymentGateWayId : null;
        contentData.iosPDFPaymentGateWayid = this.paymentTypeFreePDF == '1' ? this.iosPDFPaymentGateWayid : null;
        contentData.currencyIdPDF = this.paymentTypeFreePDF == '1' ? this.currencyIdPDF : null;
        contentData.pdfAmount = this.paymentTypeFreePDF == '1' ? this.amountPDF : null;
        contentData.pdfValidity = this.paymentTypeFreePDF == '1' ? this.validityPDF : null;
        contentData.pdfReviewText = this.paymentTypeFreePDF == '1' ? this.previewTextPDF : null;
      }

      if (this.contentPPT) {

        contentData.pptTitle = this.titlePPT;
        contentData.pptIsPaid = this.paymentTypeFreePPT;
        contentData.pptPaymentGateWayId = this.paymentTypeFreePPT == '1' ? this.pptPaymentGateWayId : null;
        contentData.iosPPTPaymentGateWayid = this.paymentTypeFreePPT == '1' ? this.iosPPTPaymentGateWayid : null;
        contentData.currencyIdPPT = this.paymentTypeFreePPT == '1' ? this.currencyIdPPT : null;
        contentData.pptAmount = this.paymentTypeFreePPT == '1' ? this.amountPPT : null;
        contentData.pptValidity = this.paymentTypeFreePPT == '1' ? this.validityPPT : null;
        contentData.pptReviewText = this.paymentTypeFreePPT == '1' ? this.previewTextPPT : null;
      }

      if (this.contentAudio) {

        contentData.audioTitle = this.titleAudio;
        contentData.audioIsPaid = this.paymentTypeFreeAudio;
        contentData.audioPaymentGateWayId = this.paymentTypeFreeAudio == '1' ? this.audioPaymentGateWayId : null;
        contentData.iosAudioPaymentGateWayid = this.paymentTypeFreeAudio == '1' ? this.iosAudioPaymentGateWayid : null;
        contentData.currencyIdAudio = this.paymentTypeFreeAudio == '1' ? this.currencyIdAudio : null;
        contentData.audioAmount = this.paymentTypeFreeAudio == '1' ? this.amountAudio : null;
        contentData.audioValidity = this.paymentTypeFreeAudio == '1' ? this.validityAudio : null;
        contentData.audioReviewText = this.paymentTypeFreeAudio == '1' ? this.previewTextAudio : null;
        contentData.audioDuration = this.audioDuration;
      }

      if (this.contentVideo) {

        contentData.videoStreamType = this.videoStreamType;
        contentData.videoStreamURL = this.videourl;
        contentData.videoTitle = this.titleVideo;
        contentData.videoIsPaid = this.paymentTypeFreeVideo;
        contentData.videoPaymentGateWayId = this.paymentTypeFreeVideo == '1' ? this.videoPaymentGateWayId : null;
        contentData.iosVideoPaymentGateWayid = this.paymentTypeFreeVideo == '1' ? this.iosVideoPaymentGateWayid : null;
        contentData.currencyIdVideo = this.paymentTypeFreeVideo == '1' ? this.currencyIdVideo : null;
        contentData.videoAmount = this.paymentTypeFreeVideo == '1' ? this.amountVideo : null;
        contentData.videoValidity = this.paymentTypeFreeVideo == '1' ? this.validityVideo : null;
        contentData.videoReviewText = this.paymentTypeFreeVideo == '1' ? this.previewTextVideo : null;
        contentData.videoDuration = this.videoStreamType == '0' ? this.videoDuration : this.urlDuration;
        contentData.videoWidth = this.videoStreamType == '0' ? this.videoWidth : null;
        contentData.videoHeight = this.videoStreamType == '0' ? this.videoHeight : null;

      }

      if (this.isEdit) {

        contentData.contentId = this.contentId;
        contentData.status = this.status;

        this.serviceContent.updateContent(contentData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.contentList[this.contentList.findIndex(obj => obj.id == this.contentId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.helperService.startLoader();

        if (this.contentAudio) {

          this.awsUpload.uploadAudioFile(this.selectedAudioFile).then(function (successRes) {

            contentData['audioUrl'] = successRes.Key;

            if (that.contentVideo && that.videoStreamType == '0' && that.selectedVideoFile !== undefined) {

              that.awsUpload.uploadVideoFile(that.selectedVideoFile).then(function (successRes) {

                contentData['videoStreamURL'] = successRes.Key;

                that.contentAdding(contentData);

              }, function (error) {

                console.log(error);

              });
            } else {

              that.contentAdding(contentData);

            }


          }, function (error) {

            console.log(error);

          });

        } else if (that.contentVideo && that.videoStreamType == '0' && that.selectedVideoFile !== undefined) {

          this.awsUpload.uploadVideoFile(this.selectedVideoFile).then(function (successRes) {

            contentData['videoStreamURL'] = successRes.Key;
            that.contentAdding(contentData);

          }, function (error) {

            console.log(error);

          });

        } else {

          that.contentAdding(contentData);

        }

      }

    }
  }

  contentAdding(contentData) {

    this.serviceContent.addContent(this.selectedPDFFile, this.selectedPPTFile, contentData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.contentList.unshift(res.data);
        this.helperService.loadDataTable();
        this.cancelEditClick();
        // location.reload();
      }
    },
      (err) => {

        console.log(err);

        this.snotify.body = err.error;
        this.snotify.onError();
      });

  }

  subjectChanged() {

    this.subjectList.forEach(subject => {

      if (this.subjectId == subject.id) {
        this.subjectIsPaid = subject.isPaid;
        this.topicsList = subject.topics;
      }
    });
  }

  topicChanged() {

    this.topicsList.forEach(topic => {

      if (this.topicId == topic.id) {

        this.topicIsPaid = topic.isPaid;

        this.paymentTypeFree = '0';
      }
    });
  }

  showPreview(contentId) {

    this.selectedPreview = this.contentList.find(obj => obj.id == contentId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(contentId) {

    this.selectedDescription = this.contentList.find(obj => obj.id == contentId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
