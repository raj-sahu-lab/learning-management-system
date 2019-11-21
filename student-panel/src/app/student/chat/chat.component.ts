import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
// import { io } from 'socket.io-client';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { SocketIoService } from './../../RestApiCall/ApiHelper/socket-io.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  socket;
  user : any;
  isChat : any = true;
  searchUserList : any ;
  message : any;
  chatData : any =[];
  instituteLogo : any;
  tutorList : any;
  private subscription: Subscription;
  tutorSelected : any;
  chatRoom : string;

  constructor(private chatService : SocketIoService, protected serviceDashboard: DashboardApiHelper, private location: Location, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = this.user.branch.account.image;

    this.getTutorList();

    this.chatService.listen('message').subscribe((data)=>{
      this.chatData.push(data);
      let objDiv = document.getElementById("chatDiv");
      if(objDiv){
        $('div').animate({scrollTop: objDiv.scrollHeight});
      }
    });

    this.chatService.listen('joinData').subscribe((data)=>{
      this.chatRoom = 's'+this.user.id+'t'+this.tutorSelected.id;
      this.chatData = [];
      this.chatData = data;
      let objDiv = document.getElementById("chatDiv");
      if(objDiv){
        $('div').animate({scrollTop: objDiv.scrollHeight});
      }
    });

  }

  toggleChatSide(){
    const element = document.querySelector("#chatSide");
    if(element.classList.contains("shown")){
      $(".app-menu").removeClass("shown");
    } else {
      $(".app-menu").addClass("shown");
    }
  }

  getTutorList(){
    this.subscription = this.serviceDashboard.getTutor().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        this.tutorList = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  goBack(){
    this.location.back();
  }

  getMessages(tutor){
    this.chatData = [];
    this.tutorSelected = tutor;
    tutor.unRead = 0;
    let data = {
      studentId : this.user.id,
      tutorId : this.tutorSelected.id,
      oldRoom : this.chatRoom,
      type : 'student'
    };
    this.chatService.joinEmit('join', data);
  }

  addUser(){
  }

  sendMessage(message){

    if(message){
      let data = {
        studentId : this.user.id,
        tutorId : this.tutorSelected.id,
        message : message,
        accountId : this.user.branch.account.id,
        type : 'student'
      }

      this.chatService.emit('message', data); 
      this.message = '';
      
      let objDiv = document.getElementById("chatDiv");
      if(objDiv){
        $('div').animate({scrollTop: objDiv.scrollHeight});
      }
    }
  }

  ngOnDestroy(){
    if(this.chatRoom){
      let data = {
        chatRoom : this.chatRoom,
        type : 'student'
      }
      this.chatService.joinEmit('leave', data);
    }

    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
