import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { TestDetailsService } from 'src/app/RestApiCall/ApiHelper/test-details.service';
import {Location} from '@angular/common';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
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

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService, public testDetailsService: TestDetailsService, private _location: Location) {
    this.subscriptions.push(this.redirectionService.getPracticeTestUrl().subscribe(id =>{
      this.practiceTestId = id;
    }));
    if(!this.practiceTestId){
      if(this.storage.get('practiceTestId')){
      this.practiceTestId = this.storage.get('practiceTestId');
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
