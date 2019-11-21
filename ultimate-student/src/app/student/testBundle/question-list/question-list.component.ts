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
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnDestroy {

  startNow : any = false;
  instituteLogo: any;
  page = 1;
  limit = 1000;
  questionList: any = [];
  answerList: any = [];
  series: any;
  set: any;
  bundle: any;
  pager = {
    index: 0,
    size: 1,
    count: 1,
  };
  previousIndex: number;
  answeredCount : number = 0;
  reviewCount : number = 0;

  timer: any = null;
  startTime: Date;
  questionStartTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  timeEnd: boolean = false;
  generalTimer: NodeJS.Timeout;
  totalTime : any = 0;

  viewImage : any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public testBundleService: TestBundleService,public router: Router,public paymentGateWayService : PaymentGateWayService, private location: Location, private toastr: ToastrService) {
    this.series = this.storage.get('bundleSeries');
    this.set = this.storage.get('bundleSet');
    this.bundle = this.storage.get('testBundle');
  }

  ngOnInit() {
    const user = this.storage.get('User');
    this.instituteLogo = user.branch.account.image;
    if(this.series){
      this.bundleQuestion(this.page, this.limit);
    }
  }

  goBack(){
    this.location.back();
  }

  bundleQuestion(page, limit){
    this.page = page;
    this.subscriptions.push(this.testBundleService.getBundleQuestionList(page, limit, this.series.series.id).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        if(this.questionList.length == 0){
          this.questionList = res.data;
        } else {
          res.data.forEach(bundle => {
            this.questionList.push(bundle);
          });
        }
        this.pager.count = this.questionList.length;

        this.questionList.forEach((question, index) => {
          question.index = index;
          question.marked = false;
          question.answered = false;
          question.timeTaken = 0;
          if(this.series.series.timed && !this.series.series.timeEqual){
            this.series.series.duration += question.duration;
          }
          if(question.options){
            question.options.forEach(option => {
              option.optionSelected = false;
            });
          }
        });

      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  requestNavigate(questionDetails : any){
    this.storage.set('bundleQuestion',questionDetails)
    // this.router.navigate(['./student/bundleQuestion']);
  }

  startTest(){
    this.startNow = true;
    this.startTime = new Date();
    this.questionStartTime = new Date();
    this.previousIndex = 0;
    this.ellapsedTime = '00:00';

    if(this.series.series.timed && this.series.series.timeEqual){
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.series.series.duration*60);
    } else if(this.series.series.timed && !this.series.series.timeEqual){
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.series.series.noEqualTotalTime*60);
    } else {
      this.duration = '';
    }
  }

  tick() {
    let now = new Date();
    let diff = (now.getTime() - this.startTime.getTime()) / 1000;
    
    if (this.ellapsedTime >= this.duration) {
      this.ellapsedTime = '00:00';
      clearInterval(this.timer);
      this.timeEnd = true;
      this.toastr.success('Time Ended, Submitted automatically');
      this.submitButtonClicked();
      
    } else 
      this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  getTimeTaken(index){
    const currentTime = new Date();
    const timeTaken = (currentTime.getTime() - this.questionStartTime.getTime()) / 1000;
    this.questionList[index].timeTaken += Math.floor(timeTaken);
    return timeTaken;
  }

  clearTimeTaken(){
    clearInterval(this.generalTimer);
    clearInterval(this.timer);
  }

  onSelect(selected, question){
    var cnt = 0;
    var qstCnt = 0;
    
    question.options.forEach(option => {
      if(question.question_type != 2){
        if(option.id!=selected.id){
          option.optionSelected = false;
        }
      }
      
      if(option.optionSelected){
        cnt++;
      }
      if(cnt>0){
        question.answered = true;
      } else {
        question.answered = false;
      }
    });
    this.questionList.forEach(question => {
      if(question.answered){
        qstCnt++;
      }
    });
    this.answeredCount = qstCnt;
  }

  markForReview(question){
    if(question.marked){
      question.marked = false;
      this.reviewCount--;
    } else {
      question.marked = true;
      this.reviewCount++;
    }
  }

  goTo(index: number) {
    this.getTimeTaken(this.previousIndex);
    if(!(index >= this.questionList.length)){
      if (index >= 0 && index < this.pager.count) {
        this.questionStartTime = new Date();

        this.pager.index = index;
        this.previousIndex = index;
        let closeSubmit: HTMLElement = document.getElementById('closeSubmit') as HTMLElement;
        closeSubmit.click();
      }
    }
  }

  showImage(image){
    this.viewImage = image;
  }

  submitButtonClicked(){
    this.answerList = [];
    this.questionList.forEach(question => {
      if(question.answered){
        var ansIds = [];
        question.options.forEach(option => {
          if(option.optionSelected){
            ansIds.push(option.id);
          }
        });
        this.answerList.push({'questionId': question.id, 'questionAnswerId':ansIds.toString(),'takenTime':question.timeTaken})
      }
    });
    const data = {
      bundleId : this.bundle.id,
      setId : this.set.set.id,
      seriesId : this.series.series.id,
      answers : this.answerList
    }
    
    this.subscriptions.push(this.testBundleService.submitBundleTest(data).subscribe((res: ServerResponse) => {
      if (res.success) {
        
        this.toastr.success(res.message);
        let closeSubmit: HTMLElement = document.getElementById('closeSubmit') as HTMLElement;
        closeSubmit.click();
        this.clearTimeTaken();
        this.router.navigate(['./student/testBundle']);
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
