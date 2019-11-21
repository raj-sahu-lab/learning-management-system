import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { AuthApiHelper } from '../../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { environment } from '../../../environments/environment';
declare var $: any;
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string;

    public firstName: string;
    public lastName: string;
    public phone: string;
    public image: string;

    public instituteList: any;
    public institute: string;

    instituteSelected = null;
    instituteImage: any;
    sidebar = true;

    constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, protected service: AuthApiHelper, protected serviceDashboard: DashboardApiHelper, public snotify: TostNotificationService, public router: Router, public helperService: HelperService, private toastr: ToastrService) {
        this.helperService.listenUserData().subscribe(value => {
            this.ngOnInit();
        });
    }

    ngOnInit() {

        const user = this.storage.get('User');

        if(user){
            this.instituteImage = user.branch.account.image;
            this.instituteSelected = user.branch;
            this.instituteList = user.instituteList;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.phone = user.phone;
            if (user.image) {
                this.image = user.image;
            } else this.image = environment.baseUrl + "assets/img/icons/default_profile_small.png";
        }
        
    }

    filterFunction() {
        var input, filter, ul, li, a, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        const div = document.getElementById("search");
        a = div.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            const txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    toggleSiderbar() {
        if ($("#app-container").has("menu-mobile")) {
            $("#app-container").removeClass("menu-mobile");
        }
        event.preventDefault();
        if (this.sidebar) {
            $("#app-container").removeClass("menu-sub-hidden show-spinner");
            $("#app-container").addClass("menu-default main-hidden menu-sub-hidden sub-hidden");
            this.sidebar = !this.sidebar;
        } else {
            $("#app-container").removeClass("menu-default main-hidden menu-sub-hidden sub-hidden");
            $("#app-container").addClass("menu-sub-hidden show-spinner");
            this.sidebar = !this.sidebar;
        }
        this.resizeCarousel();
    }

    resizeCarousel() {
        setTimeout(function () {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("resize", false, false);
            window.dispatchEvent(event);
        }, 350);
    }

    mobileSiderbar() {
        if ($("#app-container").has("menu-mobile")) {
            $("#app-container").removeClass("menu-mobile");
        }
        event.preventDefault();
        if (!this.sidebar) {
            $("#app-container").removeClass("menu-sub-hidden show-spinner");
            $("#app-container").addClass("menu-default main-hidden menu-sub-hidden sub-hidden");
            this.sidebar = !this.sidebar;
        } else {
            $("#app-container").removeClass("menu-default main-hidden menu-sub-hidden sub-hidden");
            $("#app-container").addClass("menu-sub-hidden show-spinner");
            this.sidebar = !this.sidebar;
        }
        this.resizeCarousel();
    }

    defaultImage(event){
        event.target.src = environment.baseUrl + "assets/img/icons/default_profile_small.png";
    }
}
