import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthApiHelper } from '../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../RestApiCall/NetworkLayer/toast-notification.service';
import { v4 as uuidv4 } from 'uuid'; // for change password logout all device
import { log } from 'util';

import { BaseService } from '../RestApiCall/NetworkLayer/base.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthApiHelper],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    notificationToken = JSON.parse(localStorage.getItem("notificationToken"));
    device_id = uuidv4();
    
    user = { phone: '', password: '', notificationToken :this.notificationToken,deviceId:this.device_id};
    LoginMessage = '';

    constructor(protected service: AuthApiHelper,protected baseService: BaseService, public router: Router, public snotify: TostNotificationService) {}

    ngOnInit() {
        // localStorage.clear();
    }

    onLoggedin() {
                
        localStorage.setItem('device_id', this.device_id);

        if (this.user.phone == '') {

            this.LoginMessage = 'Please enter email or phone';
            
        } else if (this.user.password == '') {

            this.LoginMessage = 'Please enter password';
            
        } else {

            this.service.login(this.user).subscribe((res: ServerResponse) => {
               
                if (res.success && res.data != null) {
                    
                    this.LoginMessage = '';
                    
                    localStorage.setItem('isLoggedin', 'true');
                    localStorage.setItem('logintoken', res.data.bearer_token);
                    localStorage.setItem('User', JSON.stringify(res.data));
                    this.router.navigate(['/dashboard']);

                } else {

                    this.LoginMessage = res.message;
                }
              },
              (err) => {
                
                if(err){
                    this.LoginMessage = err.error;
                }
                
              });

        }
    }
}
