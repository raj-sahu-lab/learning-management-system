import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-termsandcondition',
  templateUrl: './termsandcondition.component.html',
  styleUrls: ['./termsandcondition.component.css']
})
export class TermsandconditionComponent implements OnInit, OnDestroy {

  constructor(public homePageCall:HomepageHelper) { }

  terms : any;
  private subscription: Subscription;

  ngOnInit() {
    this.getTermsAndCondition();
  }

  getTermsAndCondition(){
    this.subscription = this.homePageCall.getPrivacy().subscribe((res: any) => {
      
      if(res.success && res.data){
        this.terms = res.data;
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
