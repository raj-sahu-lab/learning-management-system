import { Component } from '@angular/core';
import { PushNotificationService } from './RestApiCall/ApiHelper/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Online Tutoring Platform';
  message : any;
  constructor(private pushNotificationService: PushNotificationService){}
  ngOnInit() {
    this.pushNotificationService.requestPermission();
    this.pushNotificationService.receiveMessage();
    // this.pushNotificationService.showMessage()
    // console.log(this.pushNotificationService.showMessage());
    this.message = this.pushNotificationService.currentMessage
    if(this.message){
      this.pushNotificationService.sendMessage(this.message);
    }
    
    
   }
}
