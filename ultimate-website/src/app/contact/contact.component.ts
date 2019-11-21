import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import { ClipboardService } from 'ngx-clipboard';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactDetails: any;
  selectedBranch: any;
  isCopied1 : any =false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument, public homePageCall:HomepageHelper, private _clipboardService: ClipboardService) { }

  ngOnInit() {
    this.subscriptions.push(this._clipboardService.copyResponse$.subscribe(re => {
    }));

    if(window.innerWidth<=767){
      this._document.getElementById('nav-menu1').className = "pop-close";
    }

    this.subscriptions.push(this.homePageCall.getContact().subscribe((res: any) => {
      if(res.success && res.data){
        this.contactDetails = res.data;
      }
    },
      (err) => {

      }));
  }

  onCopyFailure() {
    alert('copy fail!');
  }

  branchSelected(branchCode){
    this.selectedBranch = branchCode;
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
