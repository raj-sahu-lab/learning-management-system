import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ContentDetailsApiHelper } from './../../RestApiCall/ApiHelper/contentDetails.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { environment } from '../../../environments/environment';
import * as BufferM3U8Video from '../../../assets/js/app.js';
import '../../../assets/js/videre.js';
import { Location } from '@angular/common';
import { ProgressLogService } from './../../RestApiCall/ApiHelper/progress-log.service';
declare let Vimeo: any;
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import videojs from 'video.js';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.css']
})
export class ContentDetailsComponent implements OnInit, OnDestroy {

  contentDetailsList: any;

  audioSelected: any = {};
  audioUrl: SafeResourceUrl = '';

  videoSelected: any = {};
  videoUrl: SafeResourceUrl;
  youtubeUrl: any;
  vimeoUrl: any;

  PDFSelected: any = {};
  PDFUrl: any;

  PPTSelected: any = {};
  PPTUrl: SafeResourceUrl = '';

  testPayDetails: any = {};

  contentId = '';
  payPalPay: boolean = false;
  isLoaded: boolean = false;
  totalPages: any;
  page: number = 1;
  zoom = 1;
  loading: any = true;
  redirectId: any;
  fromType: any;
  instituteImage: any;
  vimeoProgressTime = 0;
  youtubePlayer : any;
  private subscriptions: Subscription[] = [];
  isMp4 = false;
  mp4Video : any;

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

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public httpURL: HttpClient, public router: Router, private sanitizer: DomSanitizer, private route: ActivatedRoute, protected serviceContentDetails: ContentDetailsApiHelper, private toastr: ToastrService, public paymentGateWayService: PaymentGateWayService, private location: Location, public progressLogService : ProgressLogService) {
    this.redirectionService.getContentDetailsUrl().subscribe(data => {
      this.contentId = data.id;
      this.fromType = data.type;
    });
    if (!this.contentId) {
      if (this.storage.get('contentDetailsId')) {
        this.contentId = this.storage.get('contentDetailsId');
      }
    }
  }

  ngOnInit() {

    const user = this.storage.get('User');
    this.instituteImage = user.branch.account.image;

    // this.videoScript();
    // madeInNy = new Vimeo.Player('made-in-ny', options);

    this.disablePrint();

    let contentData: { [k: string]: any } = {

      contentId: this.contentId,
    };

    document.addEventListener('fullscreenchange', this.exitHandler);
    document.addEventListener('webkitfullscreenchange', this.exitHandler);
    document.addEventListener('mozfullscreenchange', this.exitHandler);
    document.addEventListener('MSFullscreenChange', this.exitHandler);

    this.subscriptions.push(this.serviceContentDetails.getContentDetails(contentData).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.contentDetailsList = res.data;
        if(this.contentDetailsList.purchase){
          if(this.contentDetailsList.purchase.remainHours){
            this.contentDetailsList.purchase.remainTime = this.hoursminute(this.contentDetailsList.purchase.remainHours);
          }
        }
        if(this.contentDetailsList.subject){
          if(this.contentDetailsList.subject.purchase){
            if(this.contentDetailsList.subject.purchase.remainHours){
              this.contentDetailsList.subject.purchase.remainTime = this.hoursminute(this.contentDetailsList.subject.purchase.remainHours);
            }
          }
        }

        if(this.contentDetailsList.topic){
          if(this.contentDetailsList.topic.purchase){
            if(this.contentDetailsList.topic.purchase.remainHours){
              this.contentDetailsList.topic.purchase.remainTime = this.hoursminute(this.contentDetailsList.topic.purchase.remainHours);
            }
          }
        }
        
        this.contentDetailsList.audio.forEach((audio: any) => {
          if(audio.purchase){
            if(audio.purchase.remainHours){
              audio.purchase.remainTime = this.hoursminute(audio.purchase.remainHours);
            }
          }
          
          if(audio.duration){
            audio.hr = Math.floor(audio.duration / 3600).toString();
            if (audio.hr.length == 1) {
              audio.hr = "0" + audio.hr;
            }
            audio.min = Math.floor(audio.duration % 3600 / 60).toString();
            if (audio.min.length == 1) {
              audio.min = "0" + audio.min;
            }
            audio.sec = Math.floor(audio.duration % 3600 % 60).toString();
            if (audio.sec.length == 1) {
              audio.sec = "0" + audio.sec;
            }
          }
          if(audio.audioProgress){
            if(audio.audioProgress.secounds){
              if(audio.duration){
                audio.audioPer = Math.floor((audio.audioProgress.secounds/audio.duration) * 100);
              } else audio.audioPer = 0;
            } else audio.audioPer = 0;
          } else audio.audioPer = 0;

        });

        this.contentDetailsList.pdf.forEach((pdf: any, index) => {
          if(pdf.purchase){
            if(pdf.purchase.remainHours){
              pdf.purchase.remainTime = this.hoursminute(pdf.purchase.remainHours);
            }
          }
          if(!pdf.pdfProgress){
            pdf.per = 0;
          } else{
            if(pdf.pdfProgress.secounds){
              pdf.per = pdf.pdfProgress.secounds;
            }
          } 
          this.pdfBlobUrl(pdf.url, index);

        });
        this.contentDetailsList.video.forEach((video: any) => {
          if(video.purchase){
            if(video.purchase.remainHours){
              video.purchase.remainTime = this.hoursminute(video.purchase.remainHours);
            }
          }
          if (video.type == 0) {
            if(video.duration){
              video.hr = Math.floor(video.duration / 3600).toString();
              if (video.hr.length == 1) {
                video.hr = "0" + video.hr;
              }
              video.min = Math.floor(video.duration % 3600 / 60).toString();
              if (video.min.length == 1) {
                video.min = "0" + video.min;
              }
              video.sec = Math.floor(video.duration % 3600 % 60).toString();
              if (video.sec.length == 1) {
                video.sec = "0" + video.sec;
              }
            }
            // const xhr = new XMLHttpRequest();
            // var url = video.url;
            // xhr.open('GET', url, true);
            // xhr.responseType = 'blob';

            // xhr.onload = (e: any) => {
            //   if (xhr.status === 200) {
            //     const blob = new Blob([xhr.response], { type: 'video/ogg' });
            //     video.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));

            //   }
            // };

            // xhr.send();
          } else if (video.type == 2) {
            
            let id = video.url.split("/").reverse()[0];

            this.subscriptions.push(this.serviceContentDetails.getVideoData(id).subscribe((res: any) => {
              video.vimeoImages = res.pictures.sizes[3];

              const duration = res.duration;
              video.hr = Math.floor(duration / 3600).toString();
              if (video.hr.length == 1) {
                video.hr = "0" + video.hr;
              }
              video.min = Math.floor(duration % 3600 / 60).toString();
              if (video.min.length == 1) {
                video.min = "0" + video.min;
              }
              video.sec = Math.floor(duration % 3600 % 60).toString();
              if (video.sec.length == 1) {
                video.sec = "0" + video.sec;
              }
            }));

          } else if (video.type == 1) {
            var str = video.url;
            var res = str.split("=");
            if(res[1]){
              
              if(res[2]){
                video.youtubeId= res[1].replace(/(.*?)&.*/i, "$1");
              } else video.youtubeId = res[1];
            } else {
              video.youtubeId = res[0].substring(res[0].lastIndexOf('/')+1);
            }
            
            if(video.duration){
              video.hr = Math.floor(video.duration / 3600).toString();
              if (video.hr.length == 1) {
                video.hr = "0" + video.hr;
              }
              video.min = Math.floor(video.duration % 3600 / 60).toString();
              if (video.min.length == 1) {
                video.min = "0" + video.min;
              }
              video.sec = Math.floor(video.duration % 3600 % 60).toString();
              if (video.sec.length == 1) {
                video.sec = "0" + video.sec;
              }
            } else {
              const key = environment.youTubeApiKey;
              const url = "https://www.googleapis.com/youtube/v3/videos?id=" + video.youtubeId + '&part=contentDetails&key=' + key;
              this.httpURL.get(url).subscribe((res: any) => {

                const youtubeVideo = res.items[0].contentDetails;
                const sec = this.convert_time(youtubeVideo.duration);
                video.hr = Math.floor(sec / 3600).toString();
                if (video.hr.length == 1) {
                  video.hr = "0" + video.hr;
                }
                video.min = Math.floor(sec % 3600 / 60).toString();
                if (video.min.length == 1) {
                  video.min = "0" + video.min;
                }
                video.sec = Math.floor(sec % 3600 % 60).toString();
                if (video.sec.length == 1) {
                  video.sec = "0" + video.sec;
                }

              },
                (err) => {
                  console.log(err);
                  this.toastr.error(err.error);
                });
            }
          }

          if(video.videoProgress){
            if(video.videoProgress.secounds){
              if(video.duration){
                video.videoPer = Math.floor((video.videoProgress.secounds/video.duration) * 100);
              } else video.videoPer = 0;
            } else video.videoPer = 0;
          } else video.videoPer = 0;

        });

        this.contentDetailsList.ppt.forEach(ppt => {
          if(ppt.purchase){
            if(ppt.purchase.remainHours){
              ppt.purchase.remainTime = this.hoursminute(ppt.purchase.remainHours);
            }
          }
        });

      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));

  }

  goBack(){
    this.location.back();
  }

  goToContent(){
    this.router.navigate(['./student/content/']).then(()=>{
      if(this.fromType=="topic"){
        this.redirectionService.sendContentUrl({'id' : this.storage.get('contentId'), 'type':this.fromType});
      }
      if(this.fromType=="subject"){
        this.redirectionService.sendContentUrl({'id' : this.storage.get('contentId'), 'type':this.fromType});
      }
    });
  }
  exitHandler(){
    
    setTimeout(()=>{
      if (document.fullscreen) {
        $('.vid-wrapper').addClass('is-fullscreen');
        $('.vid-wrapper button.vid-request-fullscreen i').removeClass('ion-android-expand').addClass('ion-arrow-shrink')
      } else {
        // if not fullscreen
        $('.vid-wrapper button.vid-request-fullscreen i').addClass('ion-android-expand').removeClass('ion-arrow-shrink')
        $('.vid-wrapper').removeClass('is-fullscreen');
      };

    });

  }

  convert_time(duration) {
    var a = duration.match(/\d+/g);

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
    return duration
  }

  AudioSelect(AudioIndex) {
    
    this.audioSelected.id = this.contentDetailsList.audio[AudioIndex].id;
    this.audioSelected.title = this.contentDetailsList.audio[AudioIndex].title;
    this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentDetailsList.audio[AudioIndex].url);
    this.audioSelected.preview = this.contentDetailsList.audio[AudioIndex].preview;
    this.audioSelected.paid = this.contentDetailsList.audio[AudioIndex].isPaid;
    this.audioSelected.amount = this.contentDetailsList.audio[AudioIndex].amount;
    this.audioSelected.GateWayId = this.contentDetailsList.audio[AudioIndex].paymentgateway_id;
    this.audioSelected.paymentGateWayName = this.contentDetailsList.audio[AudioIndex].payment_type ? this.contentDetailsList.audio[AudioIndex].payment_type.title : '';
    this.audioSelected.Key = this.contentDetailsList.audio[AudioIndex].payment_type ? this.contentDetailsList.audio[AudioIndex].payment_type.key : '';
    this.audioSelected.currency = this.contentDetailsList.audio[AudioIndex].currency;
    if (!this.contentDetailsList.audio[AudioIndex].isPaid || this.contentDetailsList.purchase || this.contentDetailsList.audio[AudioIndex].purchase || this.contentDetailsList.subject.purchase || this.contentDetailsList.topic.purchase) {
      this.audioSelected.paymentStatus = 0;
    } else this.audioSelected.paymentStatus = 1;
    this.audioSelected.length = this.contentDetailsList.audio[AudioIndex].length;
    setTimeout(()=>{
      let audioTime : any= document.getElementById('audio-play');
      if(this.contentDetailsList.audio[AudioIndex].audioProgress){
        audioTime.currentTime = this.contentDetailsList.audio[AudioIndex].audioProgress.secounds;
      }
    },2000);
  }

  VideoSelect(VideoIndex) {

    this.videoSelected.title = this.contentDetailsList.video[VideoIndex].title;
    this.videoSelected.videoType = this.contentDetailsList.video[VideoIndex].type;

    this.videoSelected.preview = this.contentDetailsList.video[VideoIndex].preview;
    this.videoSelected.paid = this.contentDetailsList.video[VideoIndex].isPaid;
    this.videoSelected.amount = this.contentDetailsList.video[VideoIndex].amount;
    this.videoSelected.id = this.contentDetailsList.video[VideoIndex].id;
    this.videoSelected.GateWayId = this.contentDetailsList.video[VideoIndex].paymentgateway_id;
    this.videoSelected.paymentGateWayName = this.contentDetailsList.video[VideoIndex].payment_type ? this.contentDetailsList.video[VideoIndex].payment_type.title : '';
    this.videoSelected.Key = this.contentDetailsList.video[VideoIndex].payment_type ? this.contentDetailsList.video[VideoIndex].payment_type.key : '';
    this.videoSelected.currency = this.contentDetailsList.video[VideoIndex].currency;
    if (!this.contentDetailsList.video[VideoIndex].isPaid || this.contentDetailsList.purchase || this.contentDetailsList.video[VideoIndex].purchase || this.contentDetailsList.subject.purchase || this.contentDetailsList.topic.purchase) {
      this.videoSelected.paymentStatus = 0;
    } else this.videoSelected.paymentStatus = 1;
    this.videoSelected.vidoId = this.contentDetailsList.video[VideoIndex].youtubeId;
    this.videoSelected.secSeen = this.contentDetailsList.video[VideoIndex].videoProgress ? this.contentDetailsList.video[VideoIndex].videoProgress.secounds : 0;

    if (this.videoSelected.videoType == 0) {
      if(this.contentDetailsList.video[VideoIndex].hlsURL){
        this.isMp4 = false;
        setTimeout(()=>{
          BufferM3U8Video(this.contentDetailsList.video[VideoIndex].hlsURL);
          let videotime : any= document.getElementById('html-player');
          if(this.contentDetailsList.video[VideoIndex].videoProgress){
            videotime.currentTime = this.contentDetailsList.video[VideoIndex].videoProgress.secounds;
          }
        },1000);
      } else {

        this.isMp4 = true;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentDetailsList.video[VideoIndex].url);
        setTimeout(()=>{
          this.mp4Video = videojs('vid', this.videoJsConfigObj);
          if(this.contentDetailsList.video[VideoIndex].videoProgress){
            if(this.contentDetailsList.video[VideoIndex].videoProgress.secounds){
              this.mp4Video.currentTime(this.contentDetailsList.video[VideoIndex].videoProgress.secounds);
              this.mp4Video.play();
            }
          }
        },300);

      }

    } else if (this.videoSelected.videoType == 1) {
      if (window['YT'])
      {
        window['YT'] = undefined;
      }
      this.youtubeUrl = this.convertYotubeUrl(this.contentDetailsList.video[VideoIndex].url);
      this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeUrl);
      var tag = undefined;
      tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      var player;
      var base = this;
      window['onYouTubeIframeAPIReady'] = function() {
      player = new window['YT'].Player('ytplayer', {
          height : '400',
          width : document.getElementById("ytplayer").offsetWidth,
          videoId: base.videoSelected.vidoId,
          events: {
            'onReady': onPlayerReady,
          },
          playerVars: {
            start: base.videoSelected.secSeen,
         }
        });
        function onPlayerReady(event) {
          
          $('#closeVideoPayment').click(function(){
            if(player){
              if(base.videoSelected.videoType==1){
                let duration = 0;
                if(player){
                  duration = Math.floor(player.playerInfo.currentTime);
                }
                player.stopVideo();
                player.destroy();
                player = null;
                let data = {
                  videoId : base.videoSelected.id,
                  duration : duration
                }
                base.progressLogService.videoProgress(data).subscribe((res : any)=>{
                });
              }
            } else {
              // document.getElementsByTagName("iframe")[0].src = '';
            }
          });
          event.target.playVideo();
        }
        
        function stopVideo() {
          player.stopVideo();
        }
      }
    } else {
      if(this.contentDetailsList.video[VideoIndex].videoProgress){
        if(this.contentDetailsList.video[VideoIndex].videoProgress.secounds){
          this.contentDetailsList.video[VideoIndex].url = this.contentDetailsList.video[VideoIndex].url+'#t='+this.contentDetailsList.video[VideoIndex].videoProgress.secounds+'s';
        }
      }
      this.vimeoUrl = this.convertVimeoUrl(this.contentDetailsList.video[VideoIndex].url)
      this.vimeoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.vimeoUrl);
      
    }
    this.videoSelected.length = this.contentDetailsList.video[VideoIndex].length;

  }

  convertYotubeUrl(url) {
    if (url) {
      var str = url;
      var res = str.split("=");
      var id;
      if(res[1]){
              
        if(res[2]){
          id= res[1].replace(/(.*?)&.*/i, "$1");
        } else id = res[1];
      } else {
        id = res[0].substring(res[0].lastIndexOf('/')+1);
      }
      return "https://www.youtube.com/embed/" + id;
    } else return url;
  }

  convertVimeoUrl(url) {
    if (url) {
      var str = url;
      return str.replace('https://vimeo.com/', 'https://player.vimeo.com/video/');
    }
  }

  PDFSelect(PDFIndex) {
    // this.page = 1;
    this.page = this.contentDetailsList.pdf[PDFIndex].pageRead;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.contentDetailsList.pdf[PDFIndex].url, true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'application/pdf' });
        this.PDFUrl = {
          url: URL.createObjectURL(blob),
          withCredentials: false
        }
      }
    };

    xhr.send();

    this.PDFSelected.title = this.contentDetailsList.pdf[PDFIndex].title;
    this.PDFSelected.downloadable = this.contentDetailsList.pdf[PDFIndex].downloadable;
    this.PDFSelected.preview = this.contentDetailsList.pdf[PDFIndex].preview;
    this.PDFSelected.paid = this.contentDetailsList.pdf[PDFIndex].isPaid;
    this.PDFSelected.amount = this.contentDetailsList.pdf[PDFIndex].amount;
    this.PDFSelected.id = this.contentDetailsList.pdf[PDFIndex].id;
    this.PDFSelected.GateWayId = this.contentDetailsList.pdf[PDFIndex].paymentgateway_id;
    this.PDFSelected.paymentGateWayName = this.contentDetailsList.pdf[PDFIndex].payment_type ? this.contentDetailsList.pdf[PDFIndex].payment_type.title : '';
    this.PDFSelected.Key = this.contentDetailsList.pdf[PDFIndex].payment_type ? this.contentDetailsList.pdf[PDFIndex].payment_type.key : '';
    this.PDFSelected.currency = this.contentDetailsList.pdf[PDFIndex].currency;
    if (!this.contentDetailsList.pdf[PDFIndex].isPaid || this.contentDetailsList.purchase || this.contentDetailsList.pdf[PDFIndex].purchase || this.contentDetailsList.subject.purchase || this.contentDetailsList.topic.purchase) {
      this.PDFSelected.paymentStatus = 0;
    } else this.PDFSelected.paymentStatus = 1;
    this.PDFSelected.pageRead = this.contentDetailsList.pdf[PDFIndex].pageRead;
    this.PDFSelected.url = this.contentDetailsList.pdf[PDFIndex].url;

    setTimeout(() => {
      this.loading = false;
    },
      2000);

  }

  testSelected(testId) {

    this.contentDetailsList.tests.forEach(test => {
      if (testId == test.id) {
        this.testPayDetails.id = test.id;
        this.testPayDetails.preview = test.preview;
        this.testPayDetails.title = test.title;
        this.testPayDetails.paid = test.isPaid;
        this.testPayDetails.amount = test.amount;
        this.testPayDetails.GateWayId = test.paymentgateway_id;
        this.testPayDetails.paymentGateWayName = test.payment_type ? test.payment_type.title : '';
        this.testPayDetails.Key = test.payment_type ? test.payment_type.key : '';
        this.testPayDetails.currency = test.currency;
      }
    });
  }

  PPTSelect(PPTIndex) {

    this.PPTSelected.title = this.contentDetailsList.ppt[PPTIndex].title;
    this.PPTUrl = this.contentDetailsList.ppt[PPTIndex].url;
    //this.PPTUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentDetailsList.ppt[PPTIndex].url+'&embedded=true');
    $('.ndfHFb-c4YZDc-Wrql6b').remove();

    this.PPTSelected.preview = this.contentDetailsList.ppt[PPTIndex].preview;
    this.PPTSelected.paid = this.contentDetailsList.ppt[PPTIndex].isPaid;
    this.PPTSelected.amount = this.contentDetailsList.ppt[PPTIndex].amount;
    this.PPTSelected.id = this.contentDetailsList.ppt[PPTIndex].id;
    this.PPTSelected.GateWayId = this.contentDetailsList.ppt[PPTIndex].paymentgateway_id;
    this.PPTSelected.paymentGateWayName = this.contentDetailsList.ppt[PPTIndex].payment_type ? this.contentDetailsList.ppt[PPTIndex].payment_type.title : '';
    this.PPTSelected.Key = this.contentDetailsList.ppt[PPTIndex].payment_type ? this.contentDetailsList.ppt[PPTIndex].payment_type.key : '';
    this.PPTSelected.currency = this.contentDetailsList.ppt[PPTIndex].currency;
    if (!this.contentDetailsList.ppt[PPTIndex].isPaid || this.contentDetailsList.purchase || this.contentDetailsList.ppt[PPTIndex].purchase || this.contentDetailsList.subject.purchase || this.contentDetailsList.topic.purchase) {
      this.PPTSelected.paymentStatus = 0;
    } else this.PPTSelected.paymentStatus = 1;

  }

  subscribePay() {
    this.payPalPay = false;
  }

  payementDetails(type: string, contentInfo: any) {
    let details = {
      'type': type,
      'id': contentInfo.id,
      'amount': contentInfo.amount,
      'currency': contentInfo.currency,
      'title': contentInfo.title,
      'paymentGateWayid': contentInfo.GateWayId,
      'payementGateWayname': contentInfo.paymentGateWayName,
      'key': contentInfo.Key
    }
    if ((contentInfo.paymentGateWayName == "PayPal") || (contentInfo.paymentGateWayName == "Stripe")) {
      this.payPalPay = true;
    }
    this.paymentGateWayService.sendPayementdetails(details);
  }

  payementModalClose() {
    this.payPalPay = false;
    this.paymentGateWayService.sendPayementModleStatus();
  }

  pdfPageRead(pdf){
    
    const data = {
      pdfId : pdf.id,
      duration : Math.floor((this.page/this.totalPages)*100)
    }
    this.subscriptions.push(this.progressLogService.pdfProgress(data).subscribe((res : any)=>{
    }));
  }

  closeVideo(video) {
    // this.isMp4 = false;
            
    // $("#VideoPopup").on('hidden.bs.modal', function (e) {

      if(this.mp4Video && this.isMp4){
        if(this.mp4Video.currentTime()){
          let data = {
            videoId : video.id,
            duration : Math.floor(this.mp4Video.currentTime())
          }
          this.mp4Video.pause();
          this.mp4Video.dispose();
          this.isMp4 = false;
          this.subscriptions.push(this.progressLogService.videoProgress(data).subscribe((res : any)=>{
          }));
        }
      }

      var videoUpload = $("#html-player").attr("src");
      var videoTime : any = document.getElementById('html-player');
      
      if(videoTime){
        if(videoTime.currentTime){
          const self = this;
          let data = {
            videoId : video.id,
            duration : Math.floor(videoTime.currentTime)
          }
          // $(this).videoProgressFn(data);
          this.subscriptions.push(this.progressLogService.videoProgress(data).subscribe((res : any)=>{
          }));
        }
      }
 
      $("#html-player").attr("src", "");
      $("#html-player").attr("src", videoUpload);

      //to pause youtube video
      var videoYoutube = $("#youtubeVideo").attr("src");
      var videoTime : any = document.getElementById('youtubeVideo');
      
      $("#youtubeVideo").attr("src", "");
      $("#youtubeVideo").attr("src", videoYoutube);

      //to pause vimeo video
      var videoVimeo = $("#vimeoVideo").attr("src");
      
      if(video.videoType==2){
        var iframe = document.getElementById('vimeoVideo');
        var player = new Vimeo.Player(iframe);
        player.getCurrentTime().then(crntTime => {
          this.vimeoProgressTime = crntTime;
        });
        setTimeout(()=>{
          let data = {
            videoId : video.id,
            duration : Math.floor(this.vimeoProgressTime)
          }
          player.pause();
          $("#vimeoVideo").attr("src", "");
          $("#vimeoVideo").attr("src", videoVimeo);

          this.videoProgressFn(data);
        },1000)
      }
      

    // });
  }

  videoProgressFn(data){
    this.subscriptions.push(this.progressLogService.videoProgress(data).subscribe((res : any)=>{
    }));
  }

  closeAudio(audio) {
    const audioTime : any= document.getElementById('audio-play');
    // console.log((test.currentTime/audio.length)*100);
    const data = {
      audioId : audio.id,
      duration : Math.floor(audioTime.currentTime)
    }
    
    this.subscriptions.push(this.progressLogService.audioProgress(data).subscribe((res : any)=>{
    }));
    $("#AudioPopup").on('hidden.bs.modal', function (e) {
      $(this).find('audio')[0].pause();
    });
  }

  closePpt(ppt){
    // console.log(ppt);
    var iframe = document.getElementsByTagName("iframe")[0];
    // var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")[0];
    const test = $('div.ndfHFb-c4YZDc-DARUcf-NnAfwf-cQYSPc');
    //ndfHFb-c4YZDc-DARUcf-NnAfwf-j4LONd
    
  }

  testNavigate(testDetails: any) {
    this.storage.set('testData',testDetails);
    if (testDetails.testResult != null) {
      this.router.navigate(['./student/result/']).then(() => {
        this.storage.set('resultId',testDetails.id);
        this.redirectionService.sendTestResultUrl(testDetails.id);
      });
    } else if (!testDetails.isPaid || testDetails.purchase ) {
      this.router.navigate(['./student/taketest/']).then(() => {
        this.storage.set('testId',testDetails.id);
        this.redirectionService.sendTestUrl(testDetails.id);
      });
    } else {
      this.testSelected(testDetails.id);
      let openSubscribe: HTMLElement = document.getElementById('testModalTraget') as HTMLElement;
      openSubscribe.click();
    }
  }

  practiceTestNavigation(practiceTest) {
    this.router.navigate(['./student/practice']).then(() => {
      this.storage.set('practiceTestId',practiceTest.id);
      this.redirectionService.sendPracticetestUrl(practiceTest.id);
    });
  }

  afterLoadComplete(pdfData: any) {
    
    this.page = this.page;
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }
  afterLoadComplete1(pdfData, index) {
    
    this.contentDetailsList.pdf[index].pageCount = pdfData.numPages;
    if(this.contentDetailsList.pdf[index].pdfProgress){
      this.contentDetailsList.pdf[index].pageRead = Math.floor((this.contentDetailsList.pdf[index].pdfProgress.secounds * pdfData.numPages)/100);
    } else this.contentDetailsList.pdf[index].pageRead = 1;
    document.getElementById('set-none' + index).style.display = "none";
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  zoomNeg() {
    if (this.zoom > 0) {
      this.zoom = this.zoom - 0.5;
    }
  }

  zoomPos() {
    this.zoom = this.zoom + 0.5;
  }

  disablePrint() {
    $(document).ready(function () {

      $("body").on("contextmenu", function (e) {
        return false;
      });

      $("body").bind("keyup keydown", function (e) {

        e.preventDefault();
        return false;
      });

    });
  }

  getPageCount(pdf, index) {
    this.contentDetailsList.pdf[index].pageCount = pdf.totalPages;
  }

  getAudioLength(src) {
    return new Promise(function (resolve) {
      var audio = new Audio();
      $(audio).on("loadedmetadata", function () {
        resolve(audio.duration);
      });
      audio.src = src;
    });
  }


  getDuration(e, index) {

    const duration = e.target.duration;
    this.contentDetailsList.video[index].length = duration;
    this.contentDetailsList.video[index].min = Math.floor(duration / 60);
    this.contentDetailsList.video[index].sec = Math.floor(duration % 60);

  }

  afterPayment(paymentDetails) {
    this.payPalPay = false;
    // $('.modal').modal('hide');
    let paymentTestModel: HTMLElement = document.getElementById('closeTestPayment') as HTMLElement;
    if (paymentTestModel) {
      paymentTestModel.click();
    }
    let paymentVideoModel: HTMLElement = document.getElementById('closeVideoPayment') as HTMLElement;
    if (paymentVideoModel) {
      paymentVideoModel.click();
    }
    let paymentPdfModel: HTMLElement = document.getElementById('closePdfPayment') as HTMLElement;
    if (paymentPdfModel) {
      paymentPdfModel.click();
    }
    let paymentAudioModel: HTMLElement = document.getElementById('closeAudioPayment') as HTMLElement;
    if (paymentAudioModel) {
      paymentAudioModel.click();
    }
    let paymentPptModel: HTMLElement = document.getElementById('closePptPayment') as HTMLElement;
    if (paymentPptModel) {
      paymentPptModel.click();
    }
    this.ngOnInit();
  }

  pdfBlobUrl(url, index) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'application/pdf' });
        var blobUrl = {
          url: URL.createObjectURL(blob),
          withCredentials: false
        }
        this.contentDetailsList.pdf[index].blobUrl = blobUrl;
      }
    };

    xhr.send();

  }

  setpage() {
    if (this.contentDetailsList.pdf) {
      this.PDFSelect(0);
    }
  }

  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
  }

  ngOnDestroy(){

    $(document).ready(function () {

      $("body").on("contextmenu", function (e) {
        return true;
      });
      $("body").unbind("keyup keydown");

    });

    if(this.subscriptions){
      this.subscriptions.forEach(subscription => {
        if(subscription){
          subscription.unsubscribe();
        }
      });
    }
  }

}
