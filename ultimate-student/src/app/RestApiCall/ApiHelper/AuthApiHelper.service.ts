import { Injectable, Inject} from '@angular/core';
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
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

// import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthApiHelper {

  // tslint:disable-next-line:max-line-length
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

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
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('logintoken'));
    if(this.storage.get('uid')){
      const device_id = this.storage.get('uid');
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
