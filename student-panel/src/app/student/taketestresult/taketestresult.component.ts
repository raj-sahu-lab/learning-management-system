import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { TestDetailsService } from './../../RestApiCall/ApiHelper/test-details.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
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

  constructor(public redirectionService: RedirectionService, private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService, public testDetailsService: TestDetailsService, private location: Location, public router: Router) {
    // this.testId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getTestResultUrl().subscribe(id =>{
      this.testId = id;
    }));
    if(!this.testId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.resultId){
        this.testId = ids.resultId;
      }
    }
   }

  ngOnInit() {
    this.testResult();
  }

  goBack(){
    // this.location.back();
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
