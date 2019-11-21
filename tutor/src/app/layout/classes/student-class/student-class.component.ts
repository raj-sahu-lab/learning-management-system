import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { LearnerApiHelper } from '../../../RestApiCall/ApiHelper/Learner.service';
import { StudentClassApiHelper } from '../../../RestApiCall/ApiHelper/student-class.service';
declare var $: any;
import { NgxImageCompressService } from 'ngx-image-compress';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import * as moment from 'moment-timezone';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';

@Component({
  selector: 'app-student-class',
  providers: [LearnerApiHelper, StudentClassApiHelper],
  templateUrl: './student-class.component.html',
  styleUrls: ['./student-class.component.scss']
})
export class StudentClassComponent implements OnInit {

  planId: number;
  participants = null;

  searchBox = '';

  selectedPreview: any;
  selectedDescription: any;
  selectedMeeting: any;
  selectedMeetingTitle = '';
  selectedMeetingList: any;
  selectedAttendeesMeetingList: any;

  meetingType: any;
  userId = undefined;  //Selected tutor 
  liveClassList = []; // created classes
  liveClassId = null; // for edit,delete
  liveClassUserType: number; // BlueJeans
  liveClassUserListId = undefined; //Selected Tutor

  blueJeansLiveClassUserList = [];
  blueJeansLiveClassUserListId = null;

  zoomLiveClassUserList = [];
  zoomLiveClassUserListId = null;

  liveClassUserList = []; // For listing created tutor manage on type change
  
  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  image = '';
  selectedClassImage: any;
  selectedClassFile: any;

  title = '';
  todayDate: any = new Date();
  scheduleTime: any;
  duration = 0;
  agenda = '';

  learnerList = [];
  studentId = [];

  groupList = [];
  localDatetime: any;
  studentSelectionType: undefined;

  loggedIn: any;
  public userType: number;
  isCustomDatePicker: Boolean = false;

  copyURL = '';
  contentDuration: null;

  constructor(private authApiHelper: AuthApiHelper,public router: Router, protected serviceLearner: LearnerApiHelper, protected serviceStudentClass: StudentClassApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  ngOnInit() {
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userId = User.id;
      this.planId = User.plan.plan_id;

      var thisBrowser = this.myBrowser();
      if (thisBrowser == "Safari" || thisBrowser == "IE") {
        this.isCustomDatePicker = true
      } else {
        this.scheduleTime = moment().tz(User.time_zone).format('YYYY-MM-DD') + 'T' + moment().tz(User.time_zone).format('HH:mm');
      }

      if (this.planId == 1 || this.planId == 6) {

        this.participants = 50;

      } else {

        this.participants = 75;

      }

      this.liveClassListGet();
      this.blueJeansUserListGet();
      this.zoomUserListGet();
      this.lernerListGet();
      this.groupListGet();
    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }
  }

  myBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }

  liveClassListGet() {

    this.serviceStudentClass.getLiveClassList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.liveClassList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  userChanged() {

    this.liveClassUserList = [];
    this.liveClassUserListId = undefined;

    if (this.liveClassUserType == 1) {

      this.liveClassUserList = this.blueJeansLiveClassUserList;

    } else {

      this.liveClassUserList = this.zoomLiveClassUserList;
    }

  }

  blueJeansUserListGet() {

    this.serviceStudentClass.getBlueJeansUserClassList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.blueJeansLiveClassUserList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  zoomUserListGet() {

    this.serviceStudentClass.getZoomUserClassList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.zoomLiveClassUserList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

  }

  lernerListGet() {
    this.serviceLearner.getLearnerList('0').subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.learnerList = res.data;
        this.learnerList.forEach(learner => {
          learner.selected = false;
        });

        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  studentSelection() {
    this.studentId = [];
  }

  groupListGet() {

    this.serviceStudentClass.getGroupList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.groupList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  groupCheck(groupId) {

    this.studentId = [];
    const studentData = this.groupList.find(obj => obj.group_id == groupId);
    studentData.group.forEach(ids => {
      this.studentId.push(ids.student.id);
    });

  }

  classFileChanged(fileInput: any) {
    let fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);
        this.selectedClassImage = e.target['result'];

        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;

      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  compressImage(image, fileName) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
      // create file from byte
      const imageName = fileName;
      // call method that creates a blob from dataUri
      const imageBlob = this.dataURItoBlob(result.split(',')[1]);
      // imageFile created below is the new compressed file which can be send to API in form data
      this.selectedClassFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
      this.imageSize = Math.round(this.selectedClassFile.size / 1024);
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  studentCheck(learnerId, event) {

    if (event.target.checked) {

      this.studentId.push(learnerId);
    }

    if (!event.target.checked) {

      const index = this.studentId.indexOf(learnerId);

      if (index > -1) {

        this.studentId.splice(index, 1);
      }
    }
  }

  selectAll(event) {
    this.studentId = [];
    for (let i = 0; i < this.learnerList.length; i++) {

      // const student = document.getElementById('learner' + this.learnerList[i].id) as HTMLInputElement;

      if (event.target.checked) {

        this.studentId.push(this.learnerList[i].id);
        // if(student){
        //   student.checked = true;
        // }
        this.learnerList[i].selected = true;

      } else {

        this.studentId = [];
        // if(student){
        //   student.checked = false;
        // }
        this.learnerList[i].selected = false;
      }
    }

  }

  deleteButtonClick(liveClassId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete live class?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceStudentClass.deleteLiveClass(liveClassId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.liveClassList.splice(this.liveClassList.findIndex(obj => obj.id == liveClassId), 1);
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

  cancelEditClick() {

    this.liveClassId = null;

    this.image = '';
    this.selectedClassImage = null;
    this.selectedClassFile = null;

    this.studentSelectionType = undefined;
    this.liveClassUserListId = undefined;
    this.title = '';
    this.scheduleTime = '';
    this.duration = 0;
    this.agenda = '';
    this.lernerListGet();
    this.studentId = [];

    const student = document.getElementById('selectAll') as HTMLInputElement;
    student.checked = false;
  }

  submitButtonClick() {

    if (this.selectedClassImage == null) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

      // else if (this.imageSize >= 500 && this.selectedClassFile != undefined) {

      //   this.snotify.body = 'The image size maximum allowed 500 Kb';
      //   this.snotify.onError();

      // } else if (this.imageWidth != 945 && this.imageHeight != 615 && this.selectedClassFile != undefined) {

      //   this.snotify.body = 'The image size must be 945 x 615 px.';
      //   this.snotify.onError();

      // }

    } else if (this.liveClassUserListId == undefined) {

      this.snotify.body = 'Please select user.';
      this.snotify.onError();

    } else if (this.scheduleTime == '') {

      this.snotify.body = 'Please select schedule time.';
      this.snotify.onError();

    } else if (this.duration == null || this.duration == 0) {

      this.snotify.body = 'Please enter live class duration.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter live class title.';
      this.snotify.onError();

    } else if (this.agenda == '') {

      this.snotify.body = 'Please enter live class agenda.';
      this.snotify.onError();

    } else if (this.studentId.length == 0) {

      this.snotify.body = 'Please select Students.';
      this.snotify.onError();

    } else if (this.studentId.length >= this.participants && this.liveClassUserType == 1) {

      this.snotify.body = 'You can select maximum' + this.participants + ' Students. you are select ' + this.studentId.length;
      this.snotify.onError();

    } else {

      const liveClassData: { [k: string]: any } = {

        userId: this.liveClassUserListId,
        title: this.title,
        scheduleTime: new Date(this.scheduleTime).getTime(),
        duration: this.duration,
        agenda: this.agenda,
        studentId: this.studentId
      };

      if (this.liveClassUserType == 1) {

        this.serviceStudentClass.addBlueJeansLiveClass(this.selectedClassFile, liveClassData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.liveClassList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            console.log(err);

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      } else {

        this.serviceStudentClass.addZoomLiveClass(this.selectedClassFile, liveClassData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.liveClassList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();

          }
        },
          (err) => {

            console.log(err);

            this.snotify.body = err.error;
            this.snotify.onError();

          });

      }

    }

  }

  showPreview(index) {

    this.selectedPreview = this.liveClassList[index];
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(index) {

    this.selectedDescription = this.liveClassList[index];
  }

  hideDescription() {

    this.selectedDescription = null;
  }

  startLiveClass(index) {

    this.liveClassList[index].response['zoomKey'] = this.liveClassList[index].tutor.zoomKey;

    localStorage.removeItem('meetingId');
    localStorage.removeItem('username');
    localStorage.removeItem('zoom');
    localStorage.removeItem('branch');

    this.meetingType = this.liveClassList[index].userType;

    if (this.meetingType == 1) {

      localStorage.setItem('meetingId', JSON.stringify(this.liveClassList[index].response.numericMeetingId));
      localStorage.setItem('username', JSON.stringify(this.liveClassList[index].response.moderator.username));
      window.open('/liveClassStart', '_blank');

    } else {

      this.liveClassList[index].response.meetingType = this.meetingType;
      this.liveClassList[index].response.userName = this.liveClassList[index].tutor.name;
      this.liveClassList[index].response.userEmail = this.liveClassList[index].tutor.email;
      localStorage.setItem('zoom', JSON.stringify(this.liveClassList[index].response));
      localStorage.setItem('branch', JSON.stringify(this.liveClassList[index].tutor.branch));
      window.open('/liveClassStartZoom', '_blank');
    }

  }

  downloadVideoList(index) {

    this.selectedMeeting = this.liveClassList[index];
    this.selectedMeetingTitle = this.liveClassList[index].title;
    const meetingVideoData: { [k: string]: any } = {

      bluejeansuserid: this.liveClassList[index].tutor.blueJeance.id,
      meetingid: this.liveClassList[index].response.numericMeetingId,
      meetingUUID: this.liveClassList[index].response.uuid
    };

    this.serviceStudentClass.meetingVideoList(meetingVideoData).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.selectedMeetingList = res.data;

        this.snotify.body = res.message;
        this.snotify.onSuccess();


      }
    },
      (err) => {

        console.log(err);

        this.snotify.body = err.error;
        this.snotify.onError();

      });

  }

  hideSelectedMeetingList() {

    this.selectedMeetingList = null;
    this.copyURL = '';
    this.contentDuration = null;
  }

  downloadVideo(index) {

    const videoData: { [k: string]: any } = {

      bluejeansuserid: this.selectedMeeting.tutor.blueJeance.id,
      compositeContentId: this.selectedMeetingList.recordingList[index].compositeContentId
    };

    this.serviceStudentClass.meetingVideoDownload(videoData).subscribe((res: ServerResponse) => {
      if (res.success && res.data != null) {

        // console.log(res.data.contentProperties.levels[0].file);
        // console.log(res.data.contentUrl);

        this.copyURL = res.data.contentProperties.levels[0].file;
        this.contentDuration = res.data.contentDuration;
        window.open(res.data.contentUrl, '_blank');

        this.snotify.body = res.message;
        this.snotify.onSuccess();
      }
    },
      (err) => {

        console.log(err);

        this.snotify.body = err.error;
        this.snotify.onError();

      });
  }

  downloadAttendeesList(index) {

    this.selectedMeeting = this.liveClassList[index];
    this.selectedMeetingTitle = this.liveClassList[index].title;
    const meetingVideoData: { [k: string]: any } = {

      bluejeansuserid: this.liveClassList[index].tutor.blueJeance.id,
      meetingid: this.liveClassList[index].response.numericMeetingId,
      meetingUUID: this.liveClassList[index].response.uuid
    };

    this.serviceStudentClass.meetingVideoList(meetingVideoData).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.selectedAttendeesMeetingList = res.data.meetingDetails.participantList;

        // console.log(this.selectedAttendeesMeetingList);

        this.snotify.body = res.message;
        this.snotify.onSuccess();


      }
    },
      (err) => {

        console.log(err);

        this.snotify.body = err.error;
        this.snotify.onError();

      });
  }

  hideAttendeesList() {

    this.selectedAttendeesMeetingList = null;
  }
}
