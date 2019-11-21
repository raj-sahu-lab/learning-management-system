import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { TestDetailsService } from './../../RestApiCall/ApiHelper/test-details.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taketest',
  templateUrl: './taketest.component.html',
  styleUrls: ['./taketest.component.css']
})
export class TaketestComponent implements OnInit, OnDestroy {

  introduction = true;
  startNow : any = false;
  testId : any;
  public previousStyleId : any = 'test' ;
  testQuestions : any ;
  result : any = false;
  answeredCount : number = 0;
  reviewCount : number = 0;
  pager = {
    index: 0,
    size: 1,
    count: 1,
  };

  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  timeEnd: boolean = false;
  generalTimer: NodeJS.Timeout;
  totalTime : any = 0;
  testData: any = {};
  redirectId: any;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public redirectionService: RedirectionService, public router: Router,private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService , public testDetailsService: TestDetailsService, private location: Location) {
    this.subscriptions.push(this.redirectionService.getTestUrl().subscribe(id =>{
      this.testId = id;
    }));
    if(!this.testId){
      if(this.storage.get('testId')){
        this.testId = this.storage.get('testId');
      }
    }
   }

  ngOnInit() {
    this.testData = this.storage.get('testData');
    this.testDetails();
  }

  goBack(){
    this.location.back();
  }

  testDetails(){
    
    this.subscriptions.push(this.testDetailsService.getTestDetails(this.testId).subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.testQuestions = res.data;
        
        this.pager.count = this.testQuestions.length;
        this.testQuestions.forEach(element => {
          element.answer1_selected = false;
          element.answer2_selected = false;
          element.answer3_selected = false;
          element.answer4_selected = false;
          element.marked = false;
          element.answered = false;
          element.timeTaken = 0;
        });
        
      }
    },
    (err) => {
      this.toastr.error(err.error);
    }));
  }

  tick() {
    let now = new Date();
    let diff = (now.getTime() - this.startTime.getTime()) / 1000;
    
    if (this.ellapsedTime >= this.duration) {
      this.ellapsedTime = '00:00';
      clearInterval(this.timer);
      
      if(this.pager.index+1 >= this.testQuestions.length){
        
        this.ellapsedTime = '00:00';
        clearInterval(this.timer);
        this.timeEnd = true;
        this.testSubmit();
      } else {
        this.goTo(this.pager.index+1);
      }
      
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

  onSelect(question, option) {
    
    if(!question.answered){
      this.answeredCount++;
    }
    question.answered = true;
    
    if(question.answer1 !== option){
      question.answer1_selected = false;
    }
    if(question.answer2 !== option){
      question.answer2_selected = false;
    }
    if(question.answer3 !== option){
      question.answer3_selected = false;
    }
    if(question.answer4 !== option){
      question.answer4_selected = false;
    }
    if(!question.answer1_selected && !question.answer2_selected && !question.answer3_selected && !question.answer4_selected){
      this.answeredCount--;
      question.answered = false;
    }
  }

  goTo(index: number) {
    this.ellapsedTime = '00:00';
    clearInterval(this.timer);
    clearInterval(this.generalTimer);
    
    if(!(index >= this.testQuestions.length)){
      this.startTime = new Date();
      this.generalTimer = setInterval(() => {this.getTimeTaken(index); }, 1000);
      if(this.testQuestions[index].time){
        this.timer = setInterval(() => { this.tick(); }, 1000);
        this.duration = this.parseTime(this.testQuestions[index].time*60);
      } else {
        this.duration = '';
      }
      if (index >= 0 && index < this.pager.count) {
        this.pager.index = index;
      }
    } else {
      clearInterval(this.timer);
      clearInterval(this.generalTimer);
      this.timeEnd = true;
      this.testSubmit();
    }
  }

  isAnswered(question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  startTest(){
    this.startNow = true;
    this.introduction = false;
    this.startTime = new Date();
    this.ellapsedTime = '00:00';
    this.generalTimer = setInterval(() => { this.getTimeTaken(0); }, 1000);
    
    if(this.testQuestions[0].time){
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.testQuestions[0].time*60);
    } else {
      this.duration = '';
    }
  }

  getTimeTaken(index){
    const currentTime = new Date();
    const timeTaken = (currentTime.getTime() - this.startTime.getTime()) / 1000;
    // if (index > 0){
      this.testQuestions[index].timeTaken = Math.floor(timeTaken);
    // }
    return timeTaken;
  }

  clearTimeTaken(){
    clearInterval(this.generalTimer);
    clearInterval(this.timer);
  }

  selectAnswer(id){
    let test = id;
    document.getElementById('label-'+id).style.backgroundColor = 'coral';
    if(id !== this.previousStyleId){
      document.getElementById('label-'+this.previousStyleId).style.backgroundColor = 'transparent';
    }
    this.previousStyleId = test;
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

  testSubmit(){
    // if(this.timeEnd){
    //   alert('Time Ended, dont worry you results are auto submitted');
    // } else
    // alert('are you you want to submit');
    let answers = [];
    
    this.testQuestions.forEach(question => {
      
      let answer;
      this.totalTime = this.totalTime + question.timeTaken;
      if(question.answer1_selected){
        answer = question.answer1;
      } else if(question.answer2_selected){
        answer = question.answer2;
      } else if(question.answer3_selected){
        answer = question.answer3;
      } else if(question.answer4_selected){
        answer = question.answer4;
      }
      if(question.answered){
        answers.push({"questionId":question.id,"answer":answer,"takenTime":question.timeTaken})
      }
    });
    let data = {
      "testId" : this.testId,
      "takenTime" : this.totalTime,
      "answers" : answers
    }

    this.subscriptions.push(this.testDetailsService.submitTest(data).subscribe((res: ServerResponse) =>{
      let hideEvent: HTMLElement = document.getElementById('closeSubmit') as HTMLElement;
      hideEvent.click();
      this.router.navigate(['./student/result/']).then(()=>{
        this.storage.set('resultId',this.testId);
        this.redirectionService.sendTestResultUrl(this.testId);
      });
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
