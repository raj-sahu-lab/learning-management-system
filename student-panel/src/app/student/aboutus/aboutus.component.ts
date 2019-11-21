import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit, OnDestroy {

  aboutUs : any;
  instituteLogo : any;
  private subscription: Subscription;
  
  constructor(protected serviceDashboard: DashboardApiHelper, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;

    this.getAboutUs();
  }

  goBack(){
    this.location.back();
  }

  getAboutUs(){
    this.subscription = this.serviceDashboard.getAboutUs().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        this.aboutUs = res.data;
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
