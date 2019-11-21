import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { TutorApiHelper } from '../../../RestApiCall/ApiHelper/tutor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit {
  instituteId: string;
  tutorList : any;

  constructor(private route: ActivatedRoute, protected tutorApiHelper: TutorApiHelper, public snotify: TostNotificationService, private location: Location) {
    this.instituteId = this.route.snapshot.paramMap.get('id');
   }

  ngOnInit() {
    
    this.tutorApiHelper.getTutorList(this.instituteId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {

        this.tutorList = res.data;
        
      }
    },
      (err) => {

        console.log(err);
      });
  }
}
