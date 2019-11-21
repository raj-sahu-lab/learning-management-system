import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { VideoApiHelper } from '../../../RestApiCall/ApiHelper/Video.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AWSUploadService } from '../../../AWS_Services/awsupload.service';

import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import { HttpClient } from '@angular/common/http';

import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../../shared/messaging.service';
import * as BufferM3U8Video from '../../../../assets/js/app.js';
import '../../../../assets/js/videre.js';
import { BnNgIdleService } from 'bn-ng-idle';
import videojs from 'video.js';
import { environment } from '../../../../environments/environment';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';

declare var $: any;
@Component({
  selector: 'app-video',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, VideoApiHelper],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  importLiveClass: boolean;
  filter = false;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  usedSpace = 0;

  videoList = [];
  isEdit = false;
  videoId = null;

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

  video = '';
  selectedVideo: any;
  selectedVideoFile: any;

  videourl: any;
  videoStreamType = 0;

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  status = '0';

  videoDuration: any;
  urlDuration = null;
  recordingDuration = null;
  videoWidth = null;
  videoHeight = null;
  videoSize = null;
  videoUrl: SafeResourceUrl;
  youtubeUrl: any;
  vimeoUrl: any;

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columVideo = true;
  columVideoStatus = false;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  progressPercent: number = 0;
  isMp4 = false;
  mp4Video: any;
  mp4VideoUrl: SafeResourceUrl;

  public videoJsConfigObj = {
    preload: "metadata",
    controls: true,
    autoplay: true,
    overrideNative: true,
    techOrder: ["html5", "flash"],
    html5: {
      nativeVideoTracks: false,
      nativeAudioTracks: false,
      nativeTextTracks: false,
      hls: {
        withCredentials: false,
        overrideNative: true,
        debug: true
      }
    }
  };

  constructor(private authApiHelper: AuthApiHelper, private bnIdle: BnNgIdleService, protected serviceCurrency: CurrencyApiHelper, public httpURL: HttpClient, public router: Router, public helperService: HelperService, protected serviceSpace: SpaceApiHelper, private awsUpload: AWSUploadService, private sanitizer: DomSanitizer, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSubject: SubjectApiHelper, protected serviceVideo: VideoApiHelper, public snotify: TostNotificationService, public messagingService: MessagingService) {

    this.awsUpload.getProgress().subscribe(value => {
      if (this.bnIdle) {
        this.bnIdle.resetTimer();
      }
      this.progressPercent = value;
    })

    this.messagingService.getMessage().subscribe(message => {

      const user = JSON.parse(localStorage.getItem('User'));

      if (user) {

        this.router.navigate(['/login']);

      } else {

        this.videoListGet();

        // let indexValue = 0;

        // this.videoList.forEach(singleVideo => {

        //   if(singleVideo.id == message.data.video.id) {

        //     console.log(message.data.video.title);
        //     console.log(indexValue);

        //     this.videoList[indexValue] = message.data;
        //   }

        //   indexValue ++;

        // });

      }
    });

  }

  ngOnInit() {

    try {
      this.importLiveClass = environment.importLiveClass;

      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;
      this.currencyId = User.currency_id;

      this.currencyGet();
      this.usedSpaceGet();
      this.paymentGateWayListGet();
      this.subjectAndTopicListGet();
      this.videoListGet();

      document.addEventListener('fullscreenchange', this.exitHandler);
      document.addEventListener('webkitfullscreenchange', this.exitHandler);
      document.addEventListener('mozfullscreenchange', this.exitHandler);
      document.addEventListener('MSFullscreenChange', this.exitHandler);
    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }
  }

  exitHandler() {

    setTimeout(() => {
      if (document.fullscreen) {
        $('.vid-wrapper').addClass('is-fullscreen');
        $('.vid-wrapper button.vid-request-fullscreen i').removeClass('ion-android-expand').addClass('ion-arrow-shrink');
      } else {
        // if not fullscreen
        $('.vid-wrapper button.vid-request-fullscreen i').addClass('ion-android-expand').removeClass('ion-arrow-shrink');
        $('.vid-wrapper').removeClass('is-fullscreen');
      }

    });

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

  videoListGet() {
    this.serviceVideo.getVideoList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.videoList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  FileChangedVideo(fileInput: any) {

    this.videoDuration = null;
    const that = this;

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedVideoFile = fileInput.target.files[0];
      this.videoSize = this.selectedVideoFile.size / (1024 * 1024);

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function (e) {

        that.videoWidth = video.videoWidth;
        that.videoHeight = video.videoHeight;

        window.URL.revokeObjectURL(video.src);
        that.videoDuration = video.duration.toFixed(0);

      };

      video.src = URL.createObjectURL(fileInput.target.files[0]);

    }

  }

  editButtonClick(videoId) {

    document.getElementById('startForm').scrollIntoView();

    const video = this.videoList.find(obj => obj.id == videoId);
    console.log(video);

    this.isEdit = true;
    this.videoId = videoId;

    this.subjectId = video.subject.id;
    this.subjectChanged();

    this.topicId = video.topic.id;
    this.topicChanged();

    this.contentId = video.content.id;
    this.contentChange();

    this.selectedVideo = video.video;
    this.title = video.title;

    this.videoStreamType = video.type,
      this.videourl = video.url;

    this.status = video.status ? video.status.toString() : '0';
    this.paymentTypeFree = video.isPaid ? video.isPaid.toString() : '0';
    this.paymentGateWayId = video.paymentgateway_id ? video.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = video.iosPaymentGateWay?.id ? video.iosPaymentGateWay?.id : undefined;
    this.currencyId = video.currency?.id;
    this.amount = video.amount;
    this.validity = video.validity;
    this.previewText = video.preview;
    this.previewText = video.preview;

    this.recordingDuration = video.duration;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.videoId = null;

    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;

    this.title = '';

    this.urlDuration = null;
    this.recordingDuration = null;

    this.videoStreamType = 0;
    this.video = '';
    this.videourl = '';
    this.selectedVideo = null;

    this.videoWidth = null;
    this.videoHeight = null;

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';
    this.status = '0';

  }

  deleteButtonClick(videoId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete video?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceVideo.deleteVideo(videoId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.videoList.splice(this.videoList.findIndex(obj => obj.id == videoId), 1);
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

    if (this.videoStreamType == 1) {

      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = this.videourl.match(regExp);
      const youtubeId = match[7].length == 11 ? match[7] : 'wrong';

      const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + youtubeId + '&part=contentDetails&key=YOUR_YOUTUBE_API_KEY';

      this.httpURL.get(url).subscribe((res: any) => {

        const youtubeVideo = res.items[0].contentDetails;
        that.urlDuration = this.convert_time(youtubeVideo.duration);
        that.submitProcess();

      });

    } else if (this.videoStreamType == 2) {

      const vimeoID = this.videourl.split('https://vimeo.com/')[1];

      this.serviceVideo.getVimeoDuration(vimeoID).subscribe(function (res) {

        that.urlDuration = res.duration;
        that.submitProcess();

      }, function (error) {

        console.log(error);

      });
    } else if (this.videoStreamType == 3) {

      // console.log(this.recordingDuration);
      that.urlDuration = this.recordingDuration;
      that.submitProcess();
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

    if (this.videoStreamType !== 0) {

      this.getUrlDuration();

    } else {

      this.submitProcess();

    }
  }

  submitProcess() {

    //&& this.userPurchaseTearm == 3

    if (this.videoStreamType == 0 && this.userPurchasePlan == 7 && this.usedSpace > 2) {

      this.snotify.body = 'You can not upload more than 2 GB video in a free trial.';
      this.snotify.onError();

    } else if (this.videoStreamType == 0 && (this.userPurchasePlan == 1 || this.userPurchasePlan == 6) && this.usedSpace > 25) {

      this.snotify.body = 'You can not upload more than 25 GB video in a basic plan.';
      this.snotify.onError();

    } else if (this.videoStreamType == 0 && (this.userPurchasePlan == 2 || this.userPurchasePlan == 4) && this.usedSpace > 500) {

      this.snotify.body = 'You can not upload more than 500 GB video in a premium plan.';
      this.snotify.onError();

    } else if (this.videoStreamType == 0 && (this.userPurchasePlan == 3 || this.userPurchasePlan == 5) && this.usedSpace > 1024) {

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

      this.snotify.body = 'Please enter video name.';
      this.snotify.onError();

    } else if (this.selectedVideoFile == null && this.videoId == null && this.videoStreamType == 0) {

      this.snotify.body = 'Please select file.';
      this.snotify.onError();

    } else if (this.videoSize > 100 && this.userPurchaseTearm == 3 && this.videoStreamType == 0) {

      this.snotify.body = 'You can not upload more than 100 MB video in a free trial.';
      this.snotify.onError();

    } else if (this.videourl == null && this.videoStreamType !== 0) {

      this.snotify.body = 'Please enter the link.';
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

      const that = this;

      const videoData: { [k: string]: any } = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        contentId: this.contentId,

        isPaid: this.paymentTypeFree,
        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : undefined,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : undefined,

        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        validity: this.paymentTypeFree == '1' ? this.validity : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null,
        title: this.title,
        streamType: this.videoStreamType,
        // streamURL: this.videourl,
        duration: this.videoStreamType == 0 ? this.videoDuration : this.urlDuration,
      };

      if (this.videoStreamType == 0) {

        // this.helperService.startLoader();

        if (this.isEdit) {

          videoData.videoId = this.videoId;
          videoData.status = this.status;

          if (this.selectedVideoFile == undefined) {

            that.videoEditing(videoData);

          } else {

            videoData['videoWidth'] = this.videoWidth;
            videoData['videoHeight'] = this.videoHeight;
            //console.log(videoData);

            this.awsUpload.uploadVideoFile(this.selectedVideoFile).then(function (successRes) {
              videoData['streamURL'] = successRes.Key;
              that.videoEditing(videoData);

              that.progressPercent = 0;
            }, function (error) {

              console.log(error);

            });

          }

        } else {


          videoData['videoWidth'] = this.videoWidth;
          videoData['videoHeight'] = this.videoHeight;
          //console.log(videoData);

          this.awsUpload.uploadVideoFile(this.selectedVideoFile).then(function (successRes) {
            videoData['streamURL'] = successRes.Key;
            that.videoAdding(videoData);

            that.progressPercent = 0;
          }, function (error) {

            console.log(error);

          });

        }

      } else {

        if (this.isEdit) {

          videoData['videoWidth'] = null;
          videoData['videoHeight'] = null;

          videoData['streamURL'] = this.videourl;
          videoData['videoId'] = this.videoId;
          videoData['status'] = this.status;
          that.videoEditing(videoData);

        } else {

          videoData['videoWidth'] = null;
          videoData['videoHeight'] = null;

          videoData['streamURL'] = this.videourl;
          that.videoAdding(videoData);
        }

      }

    }

  }

  videoAdding(videoData) {

    this.serviceVideo.addVideo(videoData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.videoList.unshift(res.data);
        this.helperService.loadDataTable();
        this.cancelEditClick();
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();
      });
  }

  videoEditing(videoData) {

    // console.log(videoData);
    this.serviceVideo.updateVideo(videoData).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.videoList[this.videoList.findIndex(obj => obj.id == this.videoId)] = res.data;
        this.helperService.loadDataTable();
        this.cancelEditClick();
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

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

  showPreview(videoId) {

    this.selectedPreview = this.videoList.find(obj => obj.id == videoId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(videoId) {

    this.selectedDescription = this.videoList.find(obj => obj.id == videoId);

    this.videoStreamType = this.selectedDescription.type;

    if (this.videoStreamType == 0) {

      if (this.selectedDescription.hlsURL) {

        this.isMp4 = false;
        setTimeout(() => {
          BufferM3U8Video(this.selectedDescription.hlsURL);
        }, 1000);

      } else {

        this.isMp4 = true;
        this.mp4VideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDescription.url);

        setTimeout(() => {
          this.mp4Video = videojs('vid', this.videoJsConfigObj);
        }, 300);

      }

    } else if (this.videoStreamType == 1) {

      this.youtubeUrl = this.convertYotubeUrl(this.selectedDescription.url);
      this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeUrl);

    } else {

      this.vimeoUrl = this.convertVimeoUrl(this.selectedDescription.url);
      this.vimeoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.vimeoUrl);

    }

  }

  convertYotubeUrl(url) {

    if (url) {
      const str = url;
      const res = str.split('=');
      let id;
      if (res[1]) {

        if (res[2]) {
          id = res[1].replace(/(.*?)&.*/i, '$1');
        } else { id = res[1]; }
      } else {
        id = res[0].substring(res[0].lastIndexOf('/') + 1);
      }
      return 'https://www.youtube.com/embed/' + id;
    } else { return url; }
  }

  convertVimeoUrl(url) {

    if (url) {
      const str = url;
      return str.replace('https://vimeo.com/', 'https://player.vimeo.com/video/');
    }
  }

  hideDescription() {

    if (this.mp4Video && this.isMp4) {
      if (this.mp4Video.currentTime()) {
        this.mp4Video.pause();
        this.mp4Video.dispose();
        this.isMp4 = false;
      }
    }

    const videoUpload = $('#html-player').attr('src');
    $('#html-player').attr('src', '');
    $('#html-player').attr('src', videoUpload);

    // to pause youtube video
    const videoYoutube = $('#youtubeVideo').attr('src');
    $('#youtubeVideo').attr('src', '');
    $('#youtubeVideo').attr('src', videoYoutube);

    // to pause vimeo video
    const videoVimeo = $('#vimeoVideo').attr('src');
    $('#vimeoVideo').attr('src', '');
    $('#vimeoVideo').attr('src', videoVimeo);

    this.selectedDescription = null;
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }
}
