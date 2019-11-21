import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { ZoomMtg } from '@zoomus/websdk';
import { LiveClassService } from './../RestApiCall/ApiHelper/live-class.service';
import { environment } from '../../environments/environment';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
// ZoomMtg.setZoomJSLib('http://localhost:4200/custom/path/to/lib/', '/av')

@Injectable()
@Component({
  selector: 'app-zoom-class',
  templateUrl: './zoom-class.component.html',
  styleUrls: ['./zoom-class.component.scss']
})
export class ZoomClassComponent implements OnInit {

  liveClass: any;
  meetingUrl :  any;
  
  // zoom setup
  apiKey = '';
  role = 0;
  leaveUrl = environment.baseUrl+'student/liveclass';
  user : any;
  passWord = '';

  constructor(public liveClassService : LiveClassService, @Inject(SESSION_STORAGE) private storage: WebStorageService, private toastr: ToastrService, public router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.liveClass = this.storage.get('liveclassVideoStream');
    
    if(this.liveClass.userType == 2){
      this.passWord = this.liveClass.meetingDetail.password;
      if(this.liveClass.meetingDetail.meetingId){
        this.liveClassService.getliveClassKey().subscribe((res:any)=>{
      
          if(res.success && res.data){
            this.apiKey = res.data.key;
            this.getSignature();
          }
        });
      }
    }
    
  }

  getSignature() {
    let meetingData = {
      "meetingNumber" : this.liveClass.meetingDetail.meetingId,
      "role" : this.role
    };
    this.liveClassService.getSignature(meetingData).subscribe((res:any)=>{
      if(res.success){
        this.startMeeting(res.data.signature)
      }
    });
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'
    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      disableInvite: true,
      success: (success) => {
        
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.liveClass.meetingDetail.meetingId,
          userName: this.user.firstName,
          apiKey: this.apiKey,
          userEmail: this.user.email,
          passWord: this.liveClass.meetingDetail.password,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log("Error : ",error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }


}
