import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';

@Injectable({ providedIn: 'root' })
export class TestApiHelper {

  constructor(public baseService: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getTestList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');
    
    return this.baseService.get(appApiResources.test, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  addTest(testData: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
 
    return this.baseService.post(appApiResources.test, testData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  } 

  updateTest(testData: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));   

    return this.baseService.put(appApiResources.test, testData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

  deleteTest(testId: number): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));    
    
    return this.baseService.deleted(appApiResources.test+"/"+testId, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }
}