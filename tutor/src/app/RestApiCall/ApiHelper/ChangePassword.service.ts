import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';

@Injectable({ providedIn: 'root' })
export class ChangePasswordApiHelper {

  constructor(public baseService: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  changePassword(passwordData: any,token:any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);   

    return this.baseService.put(appApiResources.changePassword, passwordData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

}