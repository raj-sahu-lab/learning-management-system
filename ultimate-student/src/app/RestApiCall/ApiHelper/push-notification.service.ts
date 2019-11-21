import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Subject, BehaviorSubject, Observable } from 'rxjs'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, public router : Router) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        }
      )
   }

   requestPermission() {
     
    this.angularFireMessaging.requestToken.subscribe(
      
      (token) => {
        this.sendToken(token);
      },
      (err) => {
        this.sendToken('');
        console.error('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
      this.angularFireMessaging.messages.subscribe(
        (payload : any) => {
          // console.log(payload);

          if(payload){
            
            if(payload.data.messageType == "SUPPORTREQUEST"){
              this.router.navigate(['./student/supportrequest/']).then(()=>{
                this.sendMessage(payload);
              });
            }
          }
          this.currentMessage.next(payload);
      })
    }

    //to get push notification token
  private _invokeToken = new Subject<any>();

  getToken(): Observable<any> {
    return this._invokeToken.asObservable();
  }

  sendToken(institute: any) {
    this._invokeToken.next(institute);
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

