import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SupportRequestService {

  constructor(public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getSupportRequest(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.supportRequest, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  postSupportRequest(suppoerRequest) : Observable<any> {
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

    return this.http.post(appApiResources.supportRequest, suppoerRequest, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getStctTypesList(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.stctTypesList, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getSupportChat(id, page): Observable<any>{
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

    return this.http.post(appApiResources.supportRequestChat+'/'+id, page, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  postSupportRequestChat(chat) : Observable<any> {
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

    return this.http.post(appApiResources.supportRequestChat, chat, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  postSupportRequestRead(id) : Observable<any> {
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

    return this.http.post(appApiResources.supportRequestChatRead, id, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getSupportData(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if(localStorage.getItem('uid')){
      const uuid = localStorage.getItem('uid');
      var uid  = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');
    
    return this.http.get(appApiResources.supportRequest+'/'+id, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }
}
