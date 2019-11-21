import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TestBundleService } from './../../../RestApiCall/ApiHelper/test-bundle.service';
import { Router } from '@angular/router';
import { RedirectionService } from './../../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bundle-test-result-list',
  templateUrl: './bundle-test-result-list.component.html',
  styleUrls: ['./bundle-test-result-list.component.css']
})
export class BundleTestResultListComponent implements OnInit, OnDestroy {

  results: any;
  result : boolean = false;
  redirectId: any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public router: Router, public testBundleService: TestBundleService, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;

    this.resultList();
  }

  goBack(){
    // this.location.back();
    this.router.navigate(['./student/dashboard']);

  }

  resultList(){
    this.subscription = this.testBundleService.getBundleResultList().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        if(res.data.length >= 1){
          this.results = res.data.reverse();
          this.results.forEach(result => {
            if(result.series.marked && !result.series.markEqual){
              result.series.questionList.forEach(question => {
                result.series.totalMarks += question.question.mark;
              });
            }
            if(result.series.timed && !result.series.timeEqual){
              result.series.questionList.forEach(question => {
                result.series.duration += question.question.duration;
              });
            }
          });
        } else
        this.result = true;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  requestNavigate(resultData){
    this.storage.set('testBundleResult', resultData);

    this.router.navigate(['./student/bundleResult']).then(()=>{
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
