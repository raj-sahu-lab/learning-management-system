import { Injectable, } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import {  map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthApiHelper {

  // tslint:disable-next-line:max-line-length
  localJson :any;

  constructor(public baseService: BaseService, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  login(postBody: any): Observable<any> {

    return this.baseService.post(appApiResources.login, postBody, null).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => {

          if (error.status == 402) {  

            var bytes  = CryptoJS.AES.decrypt(error.error.data, environment.encryptionKey);
            var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            localStorage.setItem('device_id', localStorage.getItem('device_id'));
            localStorage.setItem('User', JSON.stringify(originalText.data));
            this.router.navigate(['/planPurchase',  originalText.data.bearer_token, originalText.data.account_title]);
          }
          return throwError(error.error);
      })
    );
  }

  logout(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');

    return this.baseService.get(appApiResources.logout, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  getAllTermList(token: string): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');
    
    return this.baseService.get(appApiResources.getTermList, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  checkOfferCode(token: string, offerCode: string, termId: string): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');

    const postBody = {offerCode: offerCode, termId: termId};
    return this.baseService.post(appApiResources.checkOffer, postBody, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  purchasePlan(planData: any,token:string): Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');

    return this.baseService.post(appApiResources.purchasePlan, planData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  tryCatchFail(){

    console.log('Try Catch Fail');

    localStorage.removeItem('loggedIn');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('logintoken');
    localStorage.removeItem('User');
    localStorage.removeItem('device_id');
    localStorage.removeItem('supportRequest');

    localStorage.removeItem('rzp_device_id');
    localStorage.removeItem('invoice');
    localStorage.removeItem('meetingId');
    localStorage.removeItem('username');
    localStorage.removeItem('meetingType');
    localStorage.removeItem('zoom');

    this.router.navigate(['/login']);
  }
}
