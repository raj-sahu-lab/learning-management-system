import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blue-jeance-class',
  templateUrl: './blue-jeance-class.component.html',
  styleUrls: ['./blue-jeance-class.component.css']
})
export class BlueJeanceClassComponent implements OnInit {

  liveClass: any;
  meetingUrl :  any;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private toastr: ToastrService, public router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.liveClass = this.storage.get('liveclassVideoStream');
    
    this.meetingUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://bluejeans.com/'+this.liveClass.meetingDetail.numericMeetingId+'/webrtc/quick?embed=true');
  }

}
