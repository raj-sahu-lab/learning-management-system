import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { RegisterApiHelper } from '../../RestApiCall/ApiHelper/register.service';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addInstitute',
  providers: [RegisterApiHelper],
  templateUrl: './addInstitute.component.html',
  styleUrls: ['./addInstitute.component.css']
})
export class AddInstituteComponent implements OnInit, OnDestroy {

  instituteList = [];
  instituteIds = [];
  defaultInstitute: string;
  instituteListSelected: any;
  defaultInstituteSelected: any;
  errorMessage: string = '';
  branchCode : any;
  private subscriptions: Subscription[] = [];
  
  constructor(protected serviceDashboard: DashboardApiHelper, public router: Router,protected serviceRegister: RegisterApiHelper, private toastr: ToastrService) {
    // this.defaultInstitute = this.route.snapshot.paramMap.get('id');
    
   }

  ngOnInit() {

    this.subscriptions.push(this.serviceRegister.getInstituteList().subscribe((res: ServerResponse) => {      
    
      if (res != null && res.success && res.data != null) {
        
        this.instituteList = res.data;
        this.instituteList.forEach(institute => {
          if(institute.title=='Company'){
            setTimeout(()=>{
              let openSubscribe: HTMLElement = document.getElementById(institute.id) as HTMLElement;
              openSubscribe.click();
            },1000);
          }
          
        });
      }
    },
      (err) => {
        this.toastr.error(err.error);
        console.log(err);
      }));
    if(this.defaultInstitute=='1'){
      this.subscriptions.push(this.serviceDashboard.getInstituteList().subscribe((res: ServerResponse) => {
        this.instituteListSelected = res.data;
        this.instituteListSelected.forEach(element => {
          element.selected = false;
        });
      }));
    }

    
  }

  instituteChecked(id,event) {

    if (event.target.checked) {

      this.instituteIds.push(id);
      
    }

    if (!event.target.checked) {

      let index = this.instituteIds.indexOf(id);

      if (index > -1) {

        this.instituteIds.splice(index, 1);
      }
    }
  }

  submitButtonClick()
  {
      let instituteData:{[k: string]: any} = {
      
        instituteIdList: this.instituteIds
      };
      
      this.subscriptions.push(this.serviceRegister.addInstitutes(instituteData).subscribe((res: ServerResponse) => {
        this.subscriptions.push(this.serviceDashboard.getInstituteList().subscribe((res: ServerResponse) => {
          this.instituteListSelected = res.data;
          this.instituteListSelected.forEach(element => {
            element.selected = false;
            if(element.title=='Company'){
              setTimeout(()=>{
                let openSubscribe: HTMLElement = document.getElementById(element.id) as HTMLElement;
                openSubscribe.click();
              },1000);
            }
          });
        }));
        this.defaultInstitute = '1';
      },
        (err) => {
         console.log(err);
         this.toastr.error(err.error);
        }));
  }

  defaultInstituteChecked(id, event) {

    if (event.target.checked) {
      this.defaultInstituteSelected = id;
    }

    this.instituteListSelected.forEach(institute => {
      if(institute.id == id){
        institute.selected = true;
      } else institute.selected = false;
    });

  }

  setDefaultInstitute() {
    
    if(this.defaultInstituteSelected){
      let instituteData: { [k: string]: any } = {
        instituteId: this.defaultInstituteSelected,
      };

      this.subscriptions.push(this.serviceDashboard.setInstitute(instituteData).subscribe((res: ServerResponse) => {
        if(res.success){
          localStorage.setItem('id', JSON.stringify({'subjectId' : '','topicId': '','contentId':'', 'contentDetailsId':'', 'testId':'', 'resultId':'', 'pollId': '', 'practiceTestId': '', 'forumCatId':'', 'forumSubId':'', 'forumArtId': '', 'forumTopId':'', 'supportId':'', 'liveClassId':''}));
          localStorage.setItem('User', JSON.stringify(res.data));
          this.router.navigate(['./student/dashboard']);
        }
      },
          (err) => {
            this.toastr.error(err.error);
          }));
    } else this.errorMessage = "Select Default Institute";
    
  }

  setBranchCode(){
    let instituteData: { [k: string]: any } = {

      code: this.branchCode
    };
    if(this.branchCode){
      this.subscriptions.push(this.serviceDashboard.setBranch(instituteData).subscribe((res: ServerResponse) => {
        
        if(res.success){
          localStorage.setItem('id', JSON.stringify({'subjectId' : '','topicId': '','contentId':'', 'contentDetailsId':'', 'testId':'', 'resultId':'', 'pollId': '', 'practiceTestId': '', 'forumCatId':'', 'forumSubId':'', 'forumArtId': '', 'forumTopId':'', 'supportId':'', 'liveClassId':''}));
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('User', JSON.stringify(res.data));
          this.router.navigate(['./student/dashboard']);
        }
      },
          (err) => {
            this.toastr.error(err.error);
          }));
    }
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
