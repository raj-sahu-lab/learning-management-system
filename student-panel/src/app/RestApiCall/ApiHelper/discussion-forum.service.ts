import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { appApiResources } from './app.constants';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from '../NetworkLayer/base.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DiscussionForumService {

  constructor(public http: BaseService) { }

  getDiscussion(id : any, forumData : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    
    headers = headers.set('devicetype', '3');
    
    return this.http.post(appApiResources.discussionForumReply, forumReplyData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

}
