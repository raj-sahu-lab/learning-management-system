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
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.css']
})
export class SeriesListComponent implements OnInit, OnDestroy {

  instituteLogo: any;
  page = 1;
  limit = 10;
  seriesList: any = [];
  set: any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private toastr: ToastrService, public testBundleService: TestBundleService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location) {
    this.set = this.storage.get('bundleSet');
  }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    if(this.set){
      this.bundleSeries(this.page, this.limit);
    }
  }

  goBack(){
    this.location.back();
  }

  bundleSeries(page, limit){
    this.page = page;
    this.subscriptions.push(this.testBundleService.getBundleSeriesList(page, limit, this.set.set.id).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        if(this.seriesList.length == 0){
          this.seriesList = res.data;
        } else {
          res.data.forEach(bundle => {
            this.seriesList.push(bundle);
          });
        }
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(seriesDetails : any){
      // this.router.navigate(['./student/bundleQuestion']);

    this.storage.set('bundleSeries',seriesDetails)
    if(seriesDetails.series.studentAnswer == null){
      this.router.navigate(['./student/bundleQuestion']);
    } else this.router.navigate(['./student/testBundle']);
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
