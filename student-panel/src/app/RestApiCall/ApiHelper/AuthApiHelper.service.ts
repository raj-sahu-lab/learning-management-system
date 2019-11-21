import { Injectable, } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import {  map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

// import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthApiHelper {

  // tslint:disable-next-line:max-line-length
  constructor(public http: BaseService, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  login(postBody: any): Observable<any> {
    
    return this.http.post(appApiResources.login, postBody, null).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => {
        
        return throwError(error.error);
      })
    );
  }

  logOut():Observable<any>{
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

    return this.http.get(appApiResources.logout, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

}
