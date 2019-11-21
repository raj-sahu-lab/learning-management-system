import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { SupportApiHelper } from '../RestApiCall/ApiHelper/Support.service';
import { Router } from '@angular/router';

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public supportApiHelper : SupportApiHelper,
    public router : Router) {
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {

        localStorage.setItem("notificationToken", JSON.stringify(token));
        
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(

      (payload : any) => {
        //console.log(payload);
        if(payload){
          
          if(payload.data.messageType=="SUPPORTREQUEST") {

            this.router.navigate(['/supportChat/'+JSON.parse(payload.data.message).ticketId]).then(()=>{
              this.sendMessage(payload);
            });

          } else if(payload.data.messageType=="VIDEOPROCESSINGSTATUS") {

            this.router.navigate(['/video']).then(()=>{
              this.sendMessage(payload);
            });

          }
        }
        this.currentMessage.next(payload);
      })
  }

  //push message when tab is open
  private _invokeMessage = new Subject<any>();

  getMessage(): Observable<any> {
    return this._invokeMessage.asObservable();
  }

  sendMessage(message: any) {
    this._invokeMessage.next(message);
  }
}