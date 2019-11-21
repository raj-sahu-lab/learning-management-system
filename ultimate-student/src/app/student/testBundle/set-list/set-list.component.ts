import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentGateWayService } from './../../../RestApiCall/ApiHelper/payment-gate-way.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TestBundleService } from './../../../RestApiCall/ApiHelper/test-bundle.service';
declare var $ :any;
import { RedirectionService } from './../../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: ['./set-list.component.css']
})
export class SetListComponent implements OnInit, OnDestroy {

  instituteLogo: any;
  page = 1;
  limit = 10;
  setList: any = [];
  bundle: any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private toastr: ToastrService, public testBundleService: TestBundleService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location) {
    this.bundle = this.storage.get('testBundle');
  }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    if(this.bundle){
      this.bundleSet(this.page, this.limit);
    }
  }

  goBack(){
    this.location.back();
  }

  bundleSet(page, limit){
    this.page = page;
    this.subscriptions.push(this.testBundleService.getBundleSetList(page, limit, this.bundle.id).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        if(this.setList.length == 0){
          this.setList = res.data;
        } else {
          res.data.forEach(bundle => {
            this.setList.push(bundle);
          });
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(setDetails : any){
    this.storage.set('bundleSet',setDetails)
    this.router.navigate(['./student/bundleSeries']);
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
