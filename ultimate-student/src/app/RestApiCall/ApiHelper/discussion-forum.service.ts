import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { appApiResources } from './app.constants';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from '../NetworkLayer/base.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionForumService {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService) { }

  getDiscussion(id : any, forumData : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);

    }
    
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.discussionForum+'/'+id, forumData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  postDiscussion(forumData : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.discussionForum, forumData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  replyDiscussion(forumReplyData : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    
    headers = headers.set('devicetype', '3');
    
    return this.http.post(appApiResources.discussionForumReply, forumReplyData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

}
