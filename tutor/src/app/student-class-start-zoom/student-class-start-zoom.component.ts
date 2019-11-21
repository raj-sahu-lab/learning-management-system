import { Component, OnInit } from '@angular/core';

import { StudentClassApiHelper } from '../RestApiCall/ApiHelper/student-class.service';
import { ZoomMtg } from '@zoomus/websdk';
import { environment } from '../../environments/environment';
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-student-class-start-zoom',
  templateUrl: './student-class-start-zoom.component.html',
  styleUrls: ['./student-class-start-zoom.component.scss']
})
export class StudentClassStartZoomComponent implements OnInit {
  
  zoom:any;
  apiKey = ''; //'YOUR_ZOOM_API_KEY'
  role = 1;
  leaveUrl = './liveClass';
  user : any;
  passWord = '';
  branch = '';

  constructor(protected serviceStudentClass: StudentClassApiHelper) { }

  ngOnInit(): void {

    this.branch = JSON.parse(localStorage.getItem('branch'));
    this.zoom = JSON.parse(localStorage.getItem('zoom'));
    this.apiKey = this.zoom.zoomKey;

    this.passWord = this.zoom.password;
    if(this.zoom.id){
      if(this.apiKey){
        this.getSignature();
      } else {
        console.log('apiKey not found');
      }
    } else {
      console.log('id not found');
    }
  }

  getSignature() {
  let meetingData = {
    "branchId" : this.branch,
    "meetingNumber" : this.zoom.id,
    "role" : this.role
  };

  this.serviceStudentClass.getSignature(meetingData).subscribe((res:any)=>{
    
    if(res.success){
      this.startMeeting(res.data.signature)
    }
  },
  error => {
    console.log(error)
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
          meetingNumber: this.zoom.id,
          userName: this.zoom.userName,
          apiKey: this.apiKey,
          userEmail: this.zoom.host_email,
          passWord: this.zoom.encrypted_password,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}


