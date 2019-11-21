import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { DomSanitizer } from '@angular/platform-browser';
import { PollsService } from './../../RestApiCall/ApiHelper/polls.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit, OnDestroy {

  pollsList : any = false;
  pollsResult : any = false;
  callOnce: any = true;
  pollId : any;
  poll : any;
  answerSelected: any;
  private subscriptions: Subscription[] = [];

  constructor(public redirectionService: RedirectionService, private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService, public pollsService: PollsService, private location: Location) {
    // this.pollId = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(this.redirectionService.getPollUrl().subscribe(id =>{
      this.pollId = id;
    }));
    if(!this.pollId){
      const ids = JSON.parse(localStorage.getItem('id'));
      if(ids.pollId){
      this.pollId = ids.pollId;
      }
    }
   }

  ngOnInit() {
    this.pollDetails();
  }

  goBack(){
    this.location.back();
  }

  onSelect(option){
    this.answerSelected = option;
    this.poll.pollOptions.forEach((opt,index) => {
      if(opt.id == option.id){
        this.poll.pollOptions[index].selected = true;
      } else this.poll.pollOptions[index].selected = false;
    });
  }
  
  pollDetails(){
    this.subscriptions.push(this.pollsService.getSinglePoll(this.pollId).subscribe((res : ServerResponse) =>{
      if(res.success){
        this.pollsList = true;
        this.poll = res.data;
        this.poll.pollOptions.forEach(option => {
          option.selected = false;
        });
        if(this.poll.pollOptions){
          if(this.poll.pollOptions[0].optionCount >= 0){
            this.callOnce = false;
            this.pollsResult = true;
          }
        }
      }
    },
    (err)=>{
      this.toastr.error(err.error);
    }));
  }
  

  getPollsresult(option :any){
    
    if(this.callOnce && option){
      option.selected = true;
      let data = {
        "pollId" : this.pollId,
        "pollSelectedOptionId" : option.id
      }
      
      this.subscriptions.push(this.pollsService.submitPoll(data).subscribe((res : ServerResponse) =>{
        if(res.success){
          this.callOnce = false;
          this.poll = res.data;
          this.poll.pollOptions.forEach(options => {
            if(option.id==options.id){
              options.selected = true;
            } else options.selected = false;
          });
          this.pollsResult = true;
        }
      },
      (err) =>{
        this.toastr.error(err.error);
      }));
      
      document.getElementById('vote-'+option.id).style.color = 'coral';
    } else {
      if(option){
        alert('You have already submitted');
      }else alert('Please Select option');
    };
    this.callOnce = false;
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
