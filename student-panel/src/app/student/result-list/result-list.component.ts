import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TestDetailsService } from './../../RestApiCall/ApiHelper/test-details.service';
import { Router } from '@angular/router';
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit, OnDestroy {
  results: any;
  result : boolean = false;
  redirectId: any;
  instituteLogo : any;
  private subscription: Subscription;

  constructor(public redirectionService: RedirectionService, public router: Router, public testDetailsService: TestDetailsService, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('User'));
    this.instituteLogo = user.branch.account.image;

    this.resultList();
  }

  goBack(){
    this.location.back();
  }

  resultList(){
    this.subscription = this.testDetailsService.getResultList().subscribe((res: ServerResponse) => {
      
      if (res.success) {
        if(res.data.length > 1){
          this.results = res.data.reverse();
        } else
        this.results = res.data;
        this.result = true;
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  requestNavigate(id : number){
    this.router.navigate(['./student/result']).then(()=>{
      this.redirectId = JSON.parse(localStorage.getItem('id'));
      this.redirectId.resultId = id;
    
      localStorage.setItem('id', JSON.stringify(this.redirectId));
      this.redirectionService.sendTestResultUrl(id);
    });
    
    // this.router.navigate(['/student/result/'+id]);
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
