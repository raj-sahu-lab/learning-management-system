import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { SupportRequestService } from './../../RestApiCall/ApiHelper/support-request.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { PushNotificationService } from './../../RestApiCall/ApiHelper/push-notification.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supportrequest',
  templateUrl: './supportrequest.component.html',
  styleUrls: ['./supportrequest.component.css']
})
export class SupportrequestComponent implements OnInit, OnDestroy {

  chatConversation : any = false;
  supportRequest : any ={};
  supportChats: any;
  message : any;
  page : number = 1;
  length : number = 0;
  errorImage: string;
  direct: number = 1;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public supportRequestService: SupportRequestService, private toastr: ToastrService, public pushNotificationService : PushNotificationService, public router : Router, private location: Location) {
    this.subscriptions.push(this.redirectionService.getSupportRequestUrl().subscribe(data =>{
      this.supportRequest = data.supportData;
      this.direct = data.direct;
    }));
    if(!this.supportRequest.id){
      this.supportRequest = this.storage.get('supportRequest');
    }

    this.subscriptions.push(this.pushNotificationService.getMessage().subscribe(message => {
      
      const user = JSON.parse(localStorage.getItem('User'));
      if(!user){
        this.router.navigate(['/']);
      } else {
        if(!this.direct){
          
          if(this.supportChats && message.data.message && this.supportRequest){
            if(this.supportRequest.id == JSON.parse(message.data.message).ticketId){
              this.supportChats.push(JSON.parse(message.data.message));
            }
          }
  
          if(!this.supportChats && this.supportRequest && message.data.message){
            if(this.supportRequest.id == JSON.parse(message.data.message).ticketId){
              this.supportChats = [JSON.parse(message.data.message)];
            }
          }
          if((!this.supportRequest || (this.supportRequest.id != JSON.parse(message.data.message).ticketId)) && JSON.parse(message.data.message).ticketId){
            this.getSupportData(JSON.parse(message.data.message).ticketId);
            this.supportRequest ={
              'id' : JSON.parse(message.data.message).ticketId
            }
            this.getChat(this.page);
            this.chatConversation = true;
          }
        } else {
          this.direct = 0;
          const mes = JSON.parse(message.data.message);
          
          this.supportRequest ={
            'id' : mes.ticketId
          }
          this.getSupportData(mes.ticketId);
          this.getChat(this.page);
          this.chatConversation = true;
        }
      }
    }));
  }

  ngOnInit() {
    this.getChat(this.page);
    this.errorImage = environment.baseUrl+"assets/img/company.png";

  }

  goBack(){
    this.location.back();
  }

  getChat(page){
    
    if(this.supportRequest){
      const data = {
        'page':page
      }
      if(this.supportRequest.id){
        this.subscriptions.push(this.supportRequestService.getSupportChat(this.supportRequest.id, data).subscribe((res: ServerResponse) => {
          
          if (res && res.success && res.data != null) {
            if(page>1){
              let data = res.data.reverse();
              data.forEach(data => {
                this.supportChats.unshift(data);
              });
              this.length = res.data.length;
              if(this.length>9){
                this.page++;
              }
            } else {
              this.supportChats = res.data;
              this.length = res.data.length;
            }
          }
        },
          (err) => {
            this.toastr.error(err.error);
          }));
      }
    }
    
  }

  getSupportData(id){
    
    this.subscriptions.push(this.supportRequestService.getSupportData(id).subscribe((res: ServerResponse) => {
        
      if (res && res.success && res.data != null) {
        this.storage.set('supportRequest', res.data);
        this.supportRequest = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
    
  }

  postChat(message){
    if(message){
      const data : any = {
        'ticketId': this.supportRequest.id,
        'message': message
      }
      
      this.subscriptions.push(this.supportRequestService.postSupportRequestChat(data).subscribe((res: ServerResponse) => {
        
        if (res && res.success && res.data != null) {
          if(this.supportChats){
            this.supportChats.push(res.data);
          } else this.supportChats = [res.data];
          
          this.message = '';
        }
      },
        (err) => {
          this.toastr.error(err.error);
      }));
    }
    
  }

  toggleChat(){
    if(this.chatConversation){
      this.chatConversation = false;
    } else {
      this.chatConversation = true;
      window.scroll(0,500);
    }
    const data : any = {
      'ticketId': this.supportRequest.id,
    }
    
    this.subscriptions.push(this.supportRequestService.postSupportRequestRead(data).subscribe((res: ServerResponse) => {
      
    },
      (err) => {
        // this.toastr.error(err.error);
    }));
  }
  defaultImage(event){
    event.target.src = environment.baseUrl + "assets/img/icons/default_profile_small.png";
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => {
        if(subscription){
          subscription.unsubscribe();
        }
      });
    }
  }
}
