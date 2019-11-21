import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HomepageHelper } from './../RestApiCall/ApiHelper/homepage.service';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {

  about : any;
  account : any;
  private subscription: Subscription;

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument, @Inject(SESSION_STORAGE) private storage: WebStorageService, public homePageCall:HomepageHelper) { }

  ngOnInit() {

    if(window.innerWidth<=767){
      this._document.getElementById('nav-menu1').className = "pop-close";
    }
    this.account = this.storage.get('account');
    this.subscription = this.homePageCall.getAboutUs().subscribe((res: any) => {

      if(res.success && res.data){
        this.about = res.data;
      }
    },
      (err) => {

      });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
