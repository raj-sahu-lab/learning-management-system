import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { BaseService } from '../../../RestApiCall/NetworkLayer/base.service';
import { v4 as uuidv4 } from 'uuid'; // for change password logout all device

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    status = false;
    NULL = null;

    public userType: number;
    public account_title: string;
    public picture: string;
    public plan_id: number;
    public blueJeance: number;

    // device_id = uuidv4();
    // user = {deviceId:this.device_id};

    constructor(protected baseService: BaseService,protected service: AuthApiHelper,private translate: TranslateService, public router: Router, public snotify: TostNotificationService) {}

    ngOnInit() {
        // mobile view sidebar toggle
        $(window).scroll(function() {
            const scroll = $(window).scrollTop(),
    		headH = $('.topNav').height();
            if (!(scroll >= headH)) {
                $('#sm-leftsidebar').addClass('hide-sidebar');
            }
        });
        $('#sideList').on('click', function(e) {
            $('.sm-sidebar').removeClass('hide-sidebar');
            e.stopPropagation();
        });
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#sm-leftsidebar').length) {
                $('#sm-leftsidebar').addClass('hide-sidebar');
            }
        });
        // End mobile view sidebar toggle

        const User = JSON.parse(localStorage.getItem('User'));
        this.userType = User.userType;

        if (this.userType == 1) {

            // Institute Login
            this.account_title = User.account_title;
            this.picture = User.account_image;
            this.plan_id = User.plan.plan_id;

        } else if (this.userType == 2) {

            // Branch Login

        } else if (this.userType == 3) {

            // Tutor Login
            this.account_title = User.branch.account.title;
            this.picture = User.branch.account.image;
            this.plan_id = User.plan.plan_id;
            this.blueJeance = User.blueJeance.id;

        }

    }

    dropDown() {

        this.status = !this.status;
    }

    onLoggedout() {
       
        this.service.logout().subscribe((res: ServerResponse) => {

            if (res != null && res.success) {

                this.snotify.body = res.message;
                this.snotify.onSuccess();
                
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('isLoggedin');
                localStorage.removeItem('logintoken');
                localStorage.removeItem('User');
                localStorage.removeItem('device_id');
                localStorage.removeItem('supportRequest');

                localStorage.removeItem('rzp_device_id');
                localStorage.removeItem('invoice');
                localStorage.removeItem('meetingId');
                localStorage.removeItem('username');
                localStorage.removeItem('meetingType');
                localStorage.removeItem('zoom');

                this.router.navigate(['/login']);
            }
        },
        (err) => {

            console.log(err);
        });
        
    }

}
