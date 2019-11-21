import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { Location } from '@angular/common';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacypolicies',
  templateUrl: './privacypolicies.component.html',
  styleUrls: ['./privacypolicies.component.css']
})
export class PrivacypoliciesComponent implements OnInit, OnDestroy {
  policies: any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, protected serviceDashboard: DashboardApiHelper, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    
    this.privacyPolicies();
  }

  goBack(){
    this.location.back();
  }

  privacyPolicies(){
    this.subscription = this.serviceDashboard.getPrivacyPolicies().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        this.policies = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
