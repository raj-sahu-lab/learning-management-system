import { Injectable,Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService, @Inject(SESSION_STORAGE) private storage: WebStorageService) { }

  sendOTP(phoneNumber: any): Observable<any> {

    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');

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
 
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
      // console.log(this.storage.get('bearer_token'));

     return this.http.post(appApiResources.register, register, headers).pipe(
          map((res: Response) => res),
          catchError((error: HttpErrorResponse) => throwError(error.error))
        );
    }

    setBranch(instituteData: any): Observable<any> {

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
  
      return this.http.post(appApiResources.setBranch, instituteData, headers).pipe(
           map((res: Response) => res),
           catchError((error: HttpErrorResponse) => throwError(error.error))
         );
     }
}
