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

@Injectable({ providedIn: 'root' })
export class DashboardApiHelper {

  constructor(public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getDashboardList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.dashboard, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getInstituteList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);

    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.addInstitute, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getAllInstituteList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.instituteList, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  setInstitute(instituteData: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }

    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.setBranch, instituteData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getAboutUs(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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

  getPrivacyPolicies(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.reviewCourse, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getNotification(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    headers = headers.set('devicetype', '3');

    return this.http.get(appApiResources.notification, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getTutor(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    if (localStorage.getItem('uid')) {
      const uuid = localStorage.getItem('uid');
      var uid = CryptoJS.AES.decrypt(uuid, environment.en_key);
      var originalText = uid.toString(CryptoJS.enc.Utf8);
      var device_id = JSON.parse(originalText);
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
