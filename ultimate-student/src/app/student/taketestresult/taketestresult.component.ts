import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { DomSanitizer } from '@angular/platform-browser';
import { TestDetailsService } from './../../RestApiCall/ApiHelper/test-details.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taketestresult',
  templateUrl: './taketestresult.component.html',
  styleUrls: ['./taketestresult.component.css']
})
export class TaketestresultComponent implements OnInit, OnDestroy {
  
  testId: string;
  result : any;
  testdetails : any;
  questionAnswer : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService, public testDetailsService: TestDetailsService, private location: Location, public router: Router) {
    this.subscriptions.push(this.redirectionService.getTestResultUrl().subscribe(id =>{
      this.testId = id;
    }));
    if(!this.testId){
      if(this.storage.get('resultId')){
        this.testId = this.storage.get('resultId');
      }
    }
   }

  ngOnInit() {
    this.testResult();
  }

  goBack(){
    this.router.navigate(['./student/test']);
  }

  testResult(){
    this.subscriptions.push(this.testDetailsService.getTestResult(this.testId).subscribe((res: ServerResponse) => {
      
      if (res.success) {
        this.questionAnswer = res.data.questionAnswers;
        this.testdetails = res.data.testDetail;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
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
