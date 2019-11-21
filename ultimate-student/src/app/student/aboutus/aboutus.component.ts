import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
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
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, protected serviceDashboard: DashboardApiHelper, private location: Location, private toastr: ToastrService) { }

  ngOnInit() {
    const user = this.storage.get('User');
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
