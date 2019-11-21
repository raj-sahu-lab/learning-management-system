import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HelperService } from './../RestApiCall/NetworkLayer/helper.service';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
declare var $: any;
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  account :any;
  isLogedIn: any = 0;
  studentData: any;
  private subscription: Subscription;

  constructor(@Inject(DOCUMENT) private _document: HTMLDocument, @Inject(SESSION_STORAGE) private storage: WebStorageService, public helperService: HelperService, public router: Router) { 
    this.subscription = this.helperService.listenAccout().subscribe(value => {
      this.account = this.storage.get('account');
      if(this.storage.get('isLogedIn')){
        this.isLogedIn = this.storage.get('isLogedIn');
      }
      if(this.storage.get('studentData')){
        this.studentData = this.storage.get('studentData');
      }
    });
  }

  ngOnInit() {

    if(this.storage.get('isLogedIn')){
      this.isLogedIn = this.storage.get('isLogedIn');
    }

    if(this.storage.get('account')){
      this.account = this.storage.get('account');
    }
    
    if(this.storage.get('studentData')){
      this.studentData = this.storage.get('studentData');
    }
    if(window.innerWidth<=767){
      this._document.getElementById('nav-menu1').className = "pop-close";
      $("#hd").removeClass('light-bg');
    }
  }

  logOut(){
    this.storage.remove('isLogedIn');
    this.storage.remove('bearer_token');
    this.storage.remove('studentData');
    this.storage.remove('student_token');
    this.isLogedIn = 0;
    this.router.navigate(['/']).then(()=>{
      this.helperService.logOut();
    });
  }

  toogleSidebar(){
    if(this._document.getElementById('nav-menu1').className == "pop-close pop-open"){
        this._document.getElementById('nav-menu1').className = "pop-close";
    } else {
      this._document.getElementById('nav-menu1').className  = "pop-close pop-open";
    };
    
  }

  closePopSmall(){
    if(window.innerWidth<=767){
      this._document.getElementById('nav-menu1').className = "pop-close";
    }
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
