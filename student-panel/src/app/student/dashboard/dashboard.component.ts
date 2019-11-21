import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { HttpClient } from '@angular/common/http';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { ProfileService } from './../../RestApiCall/ApiHelper/profile.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  countryList= [];
  cityList= [];

  activeGender = null;
  countryId:any;

  public firstName: string;
  public lastName: string;
  public phone: string;
  public branch: string;

  private flag: boolean;
  DashboardList: any;
  defaultInstitute = true;
  pinCode : any;
  citySelected : any;
  countrySelected : any;
  gender : any;
  profileUpdateError : boolean = false;
  errorMessage : any;
  instituteListSelected: any;
  defaultInstituteSelected: any;
  redirectId : any = {};
  token: any;
  subId: any;
  instituteLogo : any;
  private subscriptions: Subscription[] = [];

  constructor(public redirectionService: RedirectionService, public httpURL: HttpClient,protected serviceDashboard: DashboardApiHelper, private toastr: ToastrService, public router: Router, public helperService: HelperService, public profileService : ProfileService, public route : ActivatedRoute) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.subId = this.route.snapshot.queryParamMap.get('id');
    this.getDataFromToken();
    
    this.subscriptions.push(this.helperService.listenInstitute().subscribe(value => {
      this.ngOnInit();
    }));

    
   }

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;
    
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.gender = user.gender;
    var instituteSelected = user.branch;
    if(!instituteSelected){
      // this.defaultInstitute = false;
      // this.selectedInstitute();
      this.router.navigate(['']);
    }
    this.branch = instituteSelected.name;
    this.countryCity();
    this.dashBoard();
  }

  getDataFromToken(){
    if(this.token){
      localStorage.setItem('logintoken', this.token);
      this.getUserData();
    }

    
  }

  getUserData(){
    this.subscriptions.push(this.profileService.getStudentInfo().subscribe((res: ServerResponse) => { 

      if (res != null && res.success && res.data != null) {
        
        localStorage.setItem('User', JSON.stringify(res.data));
        localStorage.setItem('isLoggedin', 'true');
        this.helperService.sendToken();

        localStorage.setItem('id', JSON.stringify({ 'subjectId': '', 'topicId': '', 'contentId': '', 'contentDetailsId': '', 'testId': '', 'resultId': '', 'pollId': '', 'practiceTestId': '', 'forumCatId': '', 'forumSubId': '', 'forumArtId': '', 'forumTopId': '', 'supportId': '', 'liveClassId': '' }));
        if (res.data.instituteList.length == 0) {
        } else {

            if (res.data.branch == null) {
            } else {

                if(this.subId){
                  this.router.navigate(['./student/topic/']).then(()=>{
                    this.redirectId = JSON.parse(localStorage.getItem('id'));
                    this.redirectId.topicId = this.subId;
                    localStorage.setItem('id', JSON.stringify(this.redirectId));
                    this.redirectionService.sendDashBoardToTopic(this.subId);
                  });
                } else {
                  const user = JSON.parse(localStorage.getItem('User'));
                  this.firstName = user.firstName;
                  this.lastName = user.lastName;
                  this.phone = user.phone;
                  this.gender = user.gender;
                  this.branch = user.branch.name;
                  this.countryCity();
                  this.dashBoard();
                }
            }
        }
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  countryCity() {

    this.subscriptions.push(this.profileService.getCounteryCity().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.countryList = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  countryChanged(){
    
    this.countryList.forEach(country => {

      if(this.countrySelected == country.id){
        this.cityList = country.citys;
        
      }
  });

  }

  dashBoard() {
    
    this.subscriptions.push(this.serviceDashboard.getDashboardList().subscribe((res: ServerResponse) => {

      if (res && res.success && res.data != null) {
        
        this.DashboardList = res.data;

        this.DashboardList.courseList.forEach(subject => {
          if(subject.purchase){
            if(subject.purchase.remainHours){
              subject.purchase.remainTime = this.hoursminute(subject.purchase.remainHours);
            }
          }
        });
        
        if(!this.gender){
          setTimeout(() => {
            let hideEvent: HTMLElement = document.getElementById('profileCompletion') as HTMLElement;
            hideEvent.click();
          }, 2000);
        }
      }
      if(!res){
        this.DashboardList = '';
      }
    },
      (err) => {

        this.defaultInstitute = false;
        this.toastr.error(err.error);

      }));
  }

  completeProfile() {
    let hideEvent: HTMLElement = document.getElementById('profileCompletionPopupClose') as HTMLElement;
    hideEvent.click();

    let showEvent: HTMLElement = document.getElementById('personalInformation') as HTMLElement;
    showEvent.click();
  }

  subjectDetails(cource) {
    
    this.DashboardList.courseList.forEach(subject => {

      if (cource.id == subject.id) {
        if (subject.isPaid == 1 && !cource.purchase) {
          this.router.navigate(['./student/subject/']).then(()=>{
            this.redirectId = JSON.parse(localStorage.getItem('id'));
            this.redirectId.subjectId = cource.id;

            localStorage.setItem('id', JSON.stringify(this.redirectId));
            this.redirectionService.sendDashBoardToSub(cource.id);
          });

        } else {
          this.router.navigate(['./student/topic/']).then(()=>{
            this.redirectId = JSON.parse(localStorage.getItem('id'));
            this.redirectId.topicId = cource.id;
            localStorage.setItem('id', JSON.stringify(this.redirectId));
            this.redirectionService.sendDashBoardToTopic(cource.id);
          });

        }
      }
    });
  }

  selectGender(gender) {
    this.activeGender = gender;
    if(gender==1){
      this.gender = "male";
    } else if(gender==2){
      this.gender = "female";
    } else 
    this.gender = "others";
  }

  updateProfile(){
    if(!this.countrySelected){
      this.profileUpdateError = true;
      this.errorMessage = "Please Select Country";
    } else if(!this.citySelected){
      this.profileUpdateError = true;
      this.errorMessage = "Please select City";
    } else if(!this.pinCode){
      this.profileUpdateError = true;
      this.errorMessage = "Please Enter Pincode";
    } else if(!this.gender){
      this.profileUpdateError = true;
      this.errorMessage = "Please select Gender";
    } else{
      this.profileUpdateError = false;
      let data = {
        'countryId' : this.countrySelected,
        'cityId' : this.citySelected,
        'pincode' : this.pinCode,
        'gender' : this.gender
      }


      this.subscriptions.push(this.profileService.setProfileShortInfo(data).subscribe((res: ServerResponse) =>{

        
        if(res.success){
          localStorage.setItem('User', JSON.stringify(res.data));

          let closeInfo: HTMLElement = document.getElementById('closePersonalInfo') as HTMLElement;
          closeInfo.click();
        }
      },
      (err) => {
        this.toastr.error(err.error);
      }));
    }
  }

  hoursminute(hrs){
    let str = hrs.toString().split(".")[1] ? Math.floor((hrs.toString().split(".")[1]*60)/100) : '00';
            
    if(str.toString().length == 1){
      str = '0'+str.toString();
    }
    return Math.floor(hrs)+':'+str;
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
