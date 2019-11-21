import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-studentClassStart',
  templateUrl: './studentClassStart.component.html',
  styleUrls: ['./studentClassStart.component.scss']
})
export class StudentClassStartComponent implements OnInit {

  meetingUrl: SafeResourceUrl = '';
  completeURL: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {

      const numericMeetingId = JSON.parse(localStorage.getItem('meetingId'));
      const username = JSON.parse(localStorage.getItem('username'));
      this.completeURL  = 'https://bluejeans.com/' + numericMeetingId + '/20192020/quick?embed=true&name='+username; //raj88.company
      this.meetingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.completeURL);      
  }

}