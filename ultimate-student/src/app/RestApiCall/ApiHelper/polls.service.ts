import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class PollsService {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getPollsList(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.polls, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getSinglePoll( pollId : any ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.polls+'/'+pollId, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  submitPoll( pollData : any ) : Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.polls, pollData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  
}
