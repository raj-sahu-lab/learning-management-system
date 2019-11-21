import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { StudentApiHelper } from '../../../RestApiCall/ApiHelper/student.service';
import { Location } from '@angular/common';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  instituteId: string;
  studentList : any;
  constructor(private route: ActivatedRoute, protected studentApiHelper: StudentApiHelper, public snotify: TostNotificationService, private location: Location, public helperService: HelperService) { 
    this.instituteId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.studentApiHelper.getStudentList(this.instituteId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {

        this.studentList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

}
