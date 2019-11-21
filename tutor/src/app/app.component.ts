import { Component, OnInit } from '@angular/core';
import { MessagingService } from "./shared/messaging.service"; //For notification
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    message;
    userActivity;
    userInactive: any;

    constructor( public router: Router,private bnIdle: BnNgIdleService,private messagingService: MessagingService) { }

    ngOnInit() {

        this.messagingService.requestPermission() //Get FCM Token
        this.messagingService.receiveMessage() // Receive MSG 
        this.message = this.messagingService.currentMessage
        if(this.message) {
          this.messagingService.sendMessage(this.message);
        }

        this.bnIdle.startWatching(7200).subscribe((isTimedOut: boolean) => {

            if (isTimedOut) {

                localStorage.removeItem('isLoggedin');
                localStorage.removeItem('logintoken');
                localStorage.removeItem('User');
                localStorage.removeItem('supportRequest');
                localStorage.removeItem('rzp_device_id');
                localStorage.removeItem('invoice');
                localStorage.removeItem('meetingId');
                localStorage.removeItem('username');

                this.router.navigate(['/login']);
            }

        });

    }

}