import { Component, OnInit, Inject } from '@angular/core';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-bundle-test-result',
  templateUrl: './bundle-test-result.component.html',
  styleUrls: ['./bundle-test-result.component.css']
})
export class BundleTestResultComponent implements OnInit {

  questionAnswer : any = [];
  testdetails : any;
  viewImage : any;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public router: Router) { 
    this.testdetails = this.storage.get('testBundleResult');
  }

  ngOnInit() {
    if(this.testdetails){
      this.testdetails.series.questionList.forEach((question : any) => {
        question.question.attempted = 0;
        question.question.studentAnswer = [];
        question.question.correctAnswer = [];
        question.question.isCorrect = 0;
        var sIndex = 0;
        if(question.question.studentAnswers.length){
          question.question.studentAnswers.forEach(answer => {
            if(question.question.id == answer.questionId){
              question.question.attempted = 1;
              var cIndex = 0;
              question.question.options.forEach((option : any) => {
                if(answer.questionAnswerId==option.id){
                  
                  if(option.optionMedia){
                    question.question.studentAnswer[sIndex] = {'optionMedia':option.optionMedia,'option':null,'isAnswer':0};
                  } else {
                    question.question.studentAnswer[sIndex] = {'optionMedia': null,'option':option.option, 'isAnswer':0};
                  }
                  if(option.isAnswer){
                    question.question.studentAnswer[sIndex].isAnswer = 1;
                    question.question.isCorrect = 1;
                    if(sIndex >= 1){

                    }
                  }
                  sIndex++;
                }
                if(option.isAnswer){
                  if(option.optionMedia){
                    question.question.correctAnswer[cIndex] = {'optionMedia':option.optionMedia,'option':null};
                  } else {
                    question.question.correctAnswer[cIndex] = {'optionMedia': null,'option':option.option};
                  }
                  cIndex ++;
                }
              });
            } else {
              var cIndex = 0;
              question.question.options.forEach((option : any) => {
                if(option.isAnswer){
                  if(option.optionMedia){
                    question.question.correctAnswer[cIndex] = {'optionMedia':option.optionMedia,'option':null};
                  } else {
                    question.question.correctAnswer[cIndex] = {'optionMedia': null,'option':option.option};
                  }
                  cIndex ++;
                }
              });
            }
            
          });
        } else {
          var cIndex = 0;
          question.question.options.forEach((option : any) => {
            if(option.isAnswer){
              if(option.optionMedia){
                question.question.correctAnswer[cIndex] = {'optionMedia':option.optionMedia,'option':null};
              } else {
                question.question.correctAnswer[cIndex] = {'optionMedia': null,'option':option.option};
              }
              cIndex ++;
            }
          });
        }
        
      });
    }
    this.questionAnswer = this.testdetails.series.questionList;
  }

  goBack(){
    this.router.navigate(['./student/testBundle']);
  }

  showImage(image){
    this.viewImage = image;
  }

}
