import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { AuthApiHelper } from '../../RestApiCall/ApiHelper/AuthApiHelper.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { environment } from '../../../environments/environment';
declare var $: any;
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

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
    private subscriptions: Subscription[] = [];

    constructor(protected service: AuthApiHelper, protected serviceDashboard: DashboardApiHelper, public router: Router, public helperService: HelperService, private toastr: ToastrService) {
        this.subscriptions.push(this.helperService.listenImage().subscribe(value => {
            const user = JSON.parse(localStorage.getItem('User'));
            if (user.image) {
                this.image = user.image;
            } else this.image = environment.baseUrl + "assets/img/icons/default_profile_small.png";
        }));
        this.subscriptions.push(this.helperService.listenToken().subscribe(value => {
            this.ngOnInit();
        }));
    }

    ngOnInit() {

        const user = JSON.parse(localStorage.getItem('User'));
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

    

    onLogOutClick() {
        this.subscriptions.push(this.service.logOut().subscribe((res: any) => {
            if (res.success) {
                this.toastr.success(res.message);
                localStorage.clear();
                this.router.navigate(['']);
            }
        },
            (err) => {
                localStorage.clear();
                this.router.navigate(['']);
                this.toastr.error(err.error);
            }));

    }

    instituteChanged(institute: any) {
        //clear ids saved for redirection
        localStorage.setItem('id', JSON.stringify({ 'subjectId': '', 'topicId': '', 'contentId': '', 'contentDetailsId': '', 'testId': '', 'resultId': '', 'pollId': '', 'practiceTestId': '', 'forumCatId': '', 'forumSubId': '', 'forumArtId': '', 'forumTopId': '', 'supportId': '', 'liveClassId': '' }));


        let instituteData: { [k: string]: any } = {
            instituteId: institute.id,
        };

        this.subscriptions.push(this.serviceDashboard.setInstitute(instituteData).subscribe((res: ServerResponse) => {
            if (res.success) {
                this.instituteSelected = institute;
                const user = JSON.parse(localStorage.getItem('User'));
                user.branch = this.instituteSelected;
                localStorage.setItem('User', JSON.stringify(user));
                this.instituteImage = user.branch.account.image;
                this.helperService.userInstitute(this.instituteSelected.id);
                this.router.navigate(['/student/dashboard']);
            }
        },
            (err) => {
                this.toastr.error(err.error);
            }));


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

    ngOnDestroy(){
        if(this.subscriptions){
          this.subscriptions.forEach(subscription => {
            if(subscription){
              subscription.unsubscribe();
            }
          });
        }
    }
}
