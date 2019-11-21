import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

import { normalChatApiHelper } from '../../../RestApiCall/ApiHelper/normalChat.service';

@Component({
  selector: 'app-normal-chat',
  templateUrl: './normal-chat.component.html',
  styleUrls: ['./normal-chat.component.scss']
})
export class NormalChatComponent implements OnInit {

  @ViewChild('scroll', { static: true }) scroll: any;

  chatStudentListList = [];
  chatData : any;
  message : any;

  studentId : null;
  tutorId : null;
  chatRoom : any;
  oldChatRoom : string;

  public loginUser: any;
  public userType: number;
  public accountId: number;
  public chatUser: any;

  constructor(public httpURL: HttpClient, protected serviceNormalChat: normalChatApiHelper,public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('User'));
    this.loginUser = user;
    this.userType = user.userType;
    this.accountId = this.userType == 1 ? user.account_id :  user.accountId;

    this.serviceNormalChat.getChatStudentList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.chatStudentListList = res.data;
      }
    },
    (err) => {

      console.log(err);
    });

    this.serviceNormalChat.listen('message').subscribe((data)=>{
      this.chatData.push(data);
      
      setTimeout(() => {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
      }, 0);

    });

    this.serviceNormalChat.listen('joinData').subscribe((data)=>{    

      this.oldChatRoom = 's'+this.studentId+'t'+this.tutorId;
      this.chatData = data;

      setTimeout(() => {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
      }, 0);
    });


  }

  getMessages(studentChat){

    this.chatUser = studentChat;

    this.studentId = studentChat.student.id,
    this.chatRoom = studentChat.chatRoom;
    this.tutorId = studentChat.chatRoom.split("t").pop()

    let data = {
      studentId : studentChat.student.id,
      tutorId : studentChat.chatRoom.split("t").pop(),
      oldRoom : this.oldChatRoom,
      type : this.userType == 1 ? 'institute' : 'tutor', // type tutor, institute
    };
    this.serviceNormalChat.joinEmit('join', data);
  }

  sendMessage(){

    let data = {
      studentId : this.studentId,
      tutorId : this.tutorId,
      message : this.message,
      accountId : this.accountId,
      type : this.userType == 1 ? 'institute' : 'tutor', // type tutor, institute
      chatRoom : this.chatRoom
    }
    this.serviceNormalChat.emit('message', data); 
    this.message = '';
    
    setTimeout(() => {
      this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
    }, 0);
  }

  ngOnDestroy(){
    if(this.chatRoom){
      let data = {
        chatRoom : this.chatRoom,
        type : this.userType == 1 ? 'institute' : 'tutor', // type tutor, institute
      }
      this.serviceNormalChat.joinEmit('leave', data);
    }
  }

  // ngAfterViewInit() {
  //   this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
  // }

}
