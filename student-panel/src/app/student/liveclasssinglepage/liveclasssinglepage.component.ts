import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-liveclasssinglepage',
  templateUrl: './liveclasssinglepage.component.html',
  styleUrls: ['./liveclasssinglepage.component.css']
})
export class LiveclasssinglepageComponent implements OnInit, OnDestroy {

  tutor : any = false;
  liveNow : any = false;
  liveClass : any;
  timeNow: any;
  user: any;
  meetingUrl: SafeResourceUrl;
  private subscription: Subscription;
  timeOffSet : any;
  showtimeZoneBtn : boolean = false;

  constructor(public redirectionService: RedirectionService, @Inject(SESSION_STORAGE) private storage: WebStorageService,public router: Router, private sanitizer: DomSanitizer, private location: Location, private toastr: ToastrService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
 
    if(!this.user.time_zone || this.user.time_zone == ""){
      this.showtimeZoneBtn = true;
      this.toastr.warning('Please update the timezone');
    }

    this.timeOffSet = moment().tz(this.user.time_zone).format('Z');

    this.liveClass = this.storage.get('liveClass');
    this.timeNow = new Date();
  }

  updateTimeZone(){
    this.router.navigate(['./student/setting'])
  }
  

  goBack(){
    this.location.back();
  }
  
  checkTutorPlay(){
    if(!this.tutor){
      document.getElementById("playTutor").click();
      this.notJoined();
    } else if(!this.liveNow){
      document.getElementById("playTutor").click();
      this.joined();
    } else {
    }
  }

  joined(){
    document.getElementById("isJoined").click();
  }

  notJoined(){
    document.getElementById("isNotJoined").click();
  }

  navigateToZoom(liveClass){
    var today = new Date();
    today.setHours(0,0,0,0);

    var scheduleTime = new Date(liveClass.formatedTime);
    if(scheduleTime >= today){
      this.storage.set('liveclassVideoStream', liveClass);
      if(liveClass.userType == 1){
        window.open(environment.baseUrl+'liveClass/blueJeance');
      } else if(liveClass.userType == 2){
        window.open(environment.baseUrl+'liveClass/zoom');
      }
    } else alert('This class ended');
    
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
