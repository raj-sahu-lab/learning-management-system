import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { Location } from '@angular/common';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  instituteLogo: any;
  notifications: any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, protected serviceDashboard: DashboardApiHelper, private location: Location, private toastr: ToastrService) { }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    this.getNotification();
  }

  goBack(){
    this.location.back();
  }

  getNotification() {
    this.subscription = this.serviceDashboard.getNotification().subscribe((res: ServerResponse) => {
      if (res && res.success && res.data != null) {
        this.notifications = res.data.reverse();
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
