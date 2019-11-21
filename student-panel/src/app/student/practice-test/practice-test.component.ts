import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TestDetailsService } from 'src/app/RestApiCall/ApiHelper/test-details.service';
import {Location} from '@angular/common';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-practice-test',
  templateUrl: './practice-test.component.html',
  styleUrls: ['./practice-test.component.scss']
})
export class PracticeTestComponent implements OnInit, OnDestroy {

  practiceTestId: string;
  practiceQuestions: any;
  viewAnswer : boolean =  true;
  pager = {
    index: 0,
    size: 1,
    count: 1,
  };
  private subscriptions: Subscription[] = [];

  constructor(public redirectionService: RedirectionService, private toastr: ToastrService, public testDetailsService: TestDetailsService, private _location: Location) {
    // this.practiceTestId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getPracticeTestUrl().subscribe(id =>{
      this.practiceTestId = id;
    }));
    if(!this.practiceTestId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.practiceTestId){
      this.practiceTestId = ids.practiceTestId;
      }
    }
  }

  ngOnInit() {
    this.practiceTest();
  }

  practiceTest(){
    this.subscriptions.push(this.testDetailsService.getPracticeTestDetails(this.practiceTestId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.practiceQuestions = res.data;
        this.pager.count = this.practiceQuestions.length;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
    }
  }

  backClicked() {
    this._location.back();
  }

  toogleView(){
    if(this.viewAnswer){
      this.viewAnswer = false;
    } else this.viewAnswer = true;
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
