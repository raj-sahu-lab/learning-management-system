import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';

import { DomSanitizer } from '@angular/platform-browser';
import { PollsService } from './../../RestApiCall/ApiHelper/polls.service';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pollslist',
  templateUrl: './pollslist.component.html',
  styleUrls: ['./pollslist.component.css']
})
export class PollslistComponent implements OnInit, OnDestroy {

  pollsList : any = false;
  polls : any ;
  redirectId: any;
  private subscription: Subscription;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public router: Router, public redirectionService: RedirectionService, private sanitizer: DomSanitizer,private route: ActivatedRoute, private toastr: ToastrService, public pollsService: PollsService, private location: Location) { }

  ngOnInit() {
    this.getPolls();
  }

  goBack(){
    this.location.back();
  }

  getPolls() {
    this.subscription = this.pollsService.getPollsList().subscribe((res : ServerResponse) =>{
      if(res.success){
        if(res.data.length){
          this.pollsList = true;
        }
        this.polls = res.data;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  navigateUrl(poll : any){
    this.router.navigate(['./student/polls']).then(()=>{
      this.storage.set('pollId', poll.id);
      this.redirectionService.sendPollUrl(poll.id);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
