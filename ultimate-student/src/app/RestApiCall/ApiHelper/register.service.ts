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

@Injectable({ providedIn: 'root' })
export class RegisterApiHelper {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  getInstituteList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.instituteList, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  sendOTP(phoneNumber: any): Observable<any> {

   return this.http.post(appApiResources.sendOTP, phoneNumber, null).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

  verifyOTP(otp: any): Observable<any> {

    return this.http.post(appApiResources.verifyOTP, otp, null).pipe(
         map((res: Response) => res),
         catchError((error: HttpErrorResponse) => throwError(error.error))
       );
   }

   signUP(register: any): Observable<any> {

    return this.http.post(appApiResources.register, register, null).pipe(
         map((res: Response) => res),
         catchError((error: HttpErrorResponse) => throwError(error.error))
       );
   }

   addInstitutes(institute: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.addInstitute, institute, headers).pipe(
         map((res: Response) => res),
         catchError((error: HttpErrorResponse) => throwError(error.error))
       );
   }

}
