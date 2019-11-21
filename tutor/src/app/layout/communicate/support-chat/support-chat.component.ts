import { Component, OnInit } from '@angular/core';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { SupportApiHelper } from '../../../RestApiCall/ApiHelper/Support.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface'; 
import { MessagingService } from '../../../shared/messaging.service';
import { Router, ActivatedRoute } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'app-support-chat',
  providers: [SupportApiHelper],
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.scss']
})
export class SupportChatComponent implements OnInit {

  supportRequest:any;
  messageList = [];
  message = "";
  ticketId = undefined;
  pageNo = 1;
  direct: number = 1;

  constructor(public router: Router, private route: ActivatedRoute, protected serviceSupport: SupportApiHelper, public snotify: TostNotificationService, public messagingService : MessagingService) {
    
    this.ticketId = this.route.snapshot.paramMap.get('id');

    this.messagingService.getMessage().subscribe(message => {
      
      const user = JSON.parse(localStorage.getItem('User'));
      
      if(!user) {

        this.router.navigate(['/login']);

      } else {
        
        const sup = JSON.parse(localStorage.getItem("supportRequest"));

        if(sup) {

          if(sup.supportData.id == JSON.parse(message.data.message).ticketId) {

            this.supportRequest = sup.supportData;

          } else if(JSON.parse(message.data.message).ticketId) {

            this.ticketId = JSON.parse(message.data.message).ticketId;
            this.getMessageList();
            this.getSupporData(this.ticketId);
          }
          this.direct = JSON.parse(localStorage.getItem("supportRequest")).direct; 

        } else if(JSON.parse(message.data.message).ticketId) {

          this.ticketId = JSON.parse(message.data.message).ticketId;
          this.getMessageList();
          this.getSupporData(this.ticketId);

        }

        if(!this.direct){
          if(this.messageList && message.data.message && this.supportRequest){
            
            if(this.supportRequest.id == JSON.parse(message.data.message).ticketId){
              this.messageList.push(JSON.parse(message.data.message));
            }
          }

          if(!this.messageList && message.data.message && this.supportRequest){
            if(this.supportRequest.id == JSON.parse(message.data.message).ticketId){
              this.messageList = [JSON.parse(message.data.message)];
            }
          }

        } else {

          this.direct = 0; 
          const mes = JSON.parse(message.data.message);
          this.ticketId = mes.ticketId;
          this.getMessageList();
          this.getSupporData(this.ticketId);
        }

      }
    });
    
  }

  ngOnInit() {

    const sup = JSON.parse(localStorage.getItem("supportRequest"));
    if(sup){
      this.supportRequest = sup.supportData;
      this.direct = JSON.parse(localStorage.getItem("supportRequest")).direct; 
    }

    this.getMessageList();

  }

  getSupporData(id) {

    this.serviceSupport.supportData(id).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        const supportRequest = {
          'supportData' : res.data,
          'direct' : 1
        }
        localStorage.setItem("supportRequest", JSON.stringify(supportRequest));
        this.supportRequest =res.data;
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

        console.log(err);
      });
  }

  getMessageList() {

    let chatData:{[k: string]: any} = {      
      page: this.pageNo,
    };

    this.serviceSupport.messageList(chatData,this.ticketId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {

        if(res.data.length!=10)
        {
          document.getElementById("loadMore").style.display = "none";
        }
        
        if(this.pageNo>1) {
          
          res.data.slice().reverse().forEach(data => {

            this.messageList.unshift(data);

          });

        } else {

          this.messageList = res.data;
        }
        
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

        console.log(err);
      });

  }
 
  loadMore() {
    this.pageNo = this.pageNo +1;
    this.getMessageList();
  }

  submitButtonClick() {
    
    if (this.message == '') {

      this.snotify.body = 'Please type message.';
      this.snotify.onError();

    } else {      
      
      let chatData:{[k: string]: any} = {
      
        ticketId: this.ticketId,
        message: this.message
      };

     
      this.serviceSupport.addMessage(chatData).subscribe((res: ServerResponse) => {

        if (res.success && res.data != null) {
          
          this.getMessageList();
          this.message = '';
          
        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });
     
    }
  }

  deleteButtonClick(chatId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete message?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSupport.deleteChatMessage(chatId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.messageList.splice(this.messageList.findIndex(obj => obj.id == chatId), 1);

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });

   
  }

  closeTicket(ticketId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to close ticket?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSupport.closeTicket(ticketId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
        this.router.navigate(['/support']);
        
      }, (err) => {

        console.log(err);
      });

    }, (no) => {

      console.log('NO');
    });

  }
}
