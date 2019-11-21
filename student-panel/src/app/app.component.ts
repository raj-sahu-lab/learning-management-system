import { Component } from '@angular/core';
import { PushNotificationService } from './RestApiCall/ApiHelper/push-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Online Tutoring Platform';
  message : any;

  // @HostListener('window:beforeunload', ['$event'])

  // beforeunloadHandler($event) {
  //   console.log($event);
  //   localStorage.clear();
  //   this.router.navigate(['']);
  // }

  constructor(private pushNotificationService: PushNotificationService, public router: Router){}
  ngOnInit() {

    // if(!localStorage.getItem('User')){
    //   this.router.navigate(['']);
    // }
    // this.pushNotificationService.requestPermission()
    this.pushNotificationService.receiveMessage()
    // this.pushNotificationService.showMessage()
    // console.log(this.pushNotificationService.showMessage());
    this.message = this.pushNotificationService.currentMessage
    if(this.message){
      this.pushNotificationService.sendMessage(this.message);
    }
    
    
   }

   ngOnDestroy(){
    console.log('des');
    localStorage.clear();
    
  }
}
