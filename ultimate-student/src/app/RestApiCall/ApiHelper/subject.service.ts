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
export class SubjectApiHelper {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  getSubjectDetails(subjectData:any): Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));

    if(this.storage.get('uid')){
      var device_id = this.storage.get('uid');
      headers = headers.set('device_id', device_id);
    }
    headers = headers.set('devicetype', '3');

    return this.http.post(appApiResources.topic,subjectData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

}
