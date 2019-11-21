import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';

@Injectable({ providedIn: 'root' })
export class EmailApiHelper {

  constructor(public baseService: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  sendEmail(attachment: any,emailData: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    const formData = new FormData();

    formData.append('attachmentUrl', attachment);

    for (const key in emailData) {

      let value = emailData[key];
      if (value != null) {
        formData.append(key, value);
      }
    }
 
    return this.baseService.post(appApiResources.email, formData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

  getCampaignList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');

    return this.baseService.get(appApiResources.email, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  campaignRecipients(campaignId: number): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');
    
    return this.baseService.get(appApiResources.email + "/" + campaignId, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

}