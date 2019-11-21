import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit, OnDestroy {

  errMessage : any;

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService) { }

  ngOnInit() {
    this.errMessage = this.storage.get('error');
  }

  ngOnDestroy(){
    if(this.storage.get('error')){
      this.storage.remove('error');
    }
  }

}
