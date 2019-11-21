import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policies',
  templateUrl: './privacy-policies.component.html',
  styleUrls: ['./privacy-policies.component.css']
})
export class PrivacyPoliciesComponent implements OnInit, OnDestroy {
  policy: any;
  private subscription: Subscription;

  constructor(public homePageCall:HomepageHelper) { }

  ngOnInit() {
    this.getPrivacyPolicy();
  }

  getPrivacyPolicy(){
    this.subscription = this.homePageCall.getPrivacy().subscribe((res: any) => {
      if(res.success && res.data){
        this.policy = res.data;
      }
    },
      (err) => {

      });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
