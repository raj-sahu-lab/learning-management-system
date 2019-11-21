import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { loginApiHelper } from '../RestApiCall/ApiHelper/login.service';
import { ServerResponse } from '../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [loginApiHelper],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    user = { email: '', password: ''};
    LoginMessage = '';

    constructor(protected serviceLogin: loginApiHelper, public router: Router, public snotify: TostNotificationService) {}

    ngOnInit() {}

    onLoggedin() {

        if (this.user.email === '') {

            this.LoginMessage = 'Please enter email';
            
        } else if (this.user.password === '') {

            this.LoginMessage = 'Please enter password';
            
        } else {

            this.serviceLogin.login(this.user).subscribe((res: ServerResponse) => {

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

                console.log(err);

                this.LoginMessage = 'Invalid username or passowrd!';
              });

        }
    }
}
