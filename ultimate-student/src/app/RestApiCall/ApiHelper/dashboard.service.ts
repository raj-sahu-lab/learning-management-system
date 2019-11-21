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
export class DashboardApiHelper {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  getDashboardList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');
    
    return this.http.get(appApiResources.dashboard, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

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

    return this.http.get(appApiResources.addInstitute, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getAllInstituteList(): Observable<any> {

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

  setInstitute(instituteData: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.setDefaultInstitute, instituteData, headers).pipe(
         map((res: Response) => res),
         catchError((error: HttpErrorResponse) => throwError(error.error))
       );
   }

  setBranch(instituteData: any): Observable<any> {

  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

  if(this.storage.get('uid')){
    const device_id = this.storage.get('uid');
    headers = headers.set('device_id', device_id);
  }
  
  headers = headers.set('devicetype', '3');

  return this.http.post(appApiResources.setBranch, instituteData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

  getAboutUs() : Observable<any>{
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

  if(this.storage.get('uid')){
    const device_id = this.storage.get('uid');
    headers = headers.set('device_id', device_id);
  }
  headers = headers.set('Cache-Control', 'no-cache');
  headers = headers.set('Pragma', 'no-cache');
  headers = headers.set('devicetype', '3');

  return this.http.get(appApiResources.aboutUs, headers).pipe(
    map((res: Response) => res),
    catchError((error: HttpErrorResponse) => throwError(error.error))
  );
  }

  getPrivacyPolicies() : Observable<any>{
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

  if(this.storage.get('uid')){
    const device_id = this.storage.get('uid');
    headers = headers.set('device_id', device_id);
  }
  headers = headers.set('Cache-Control', 'no-cache');
  headers = headers.set('Pragma', 'no-cache');
  headers = headers.set('devicetype', '3');

  return this.http.get(appApiResources.privacyPolicies, headers).pipe(
    map((res: Response) => res),
    catchError((error: HttpErrorResponse) => throwError(error.error))
  );
  }

  getReviewCourse(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.reviewCourse, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getNotification(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.notification, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getAuthData(data: any): Observable<any> {

    let headers = new HttpHeaders();

    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.loginWithPhone, data, headers).pipe(
         map((res: Response) => res),
         catchError((error: HttpErrorResponse) => throwError(error.error))
       );
   }

   getTutor(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.tutor, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }
  
}
