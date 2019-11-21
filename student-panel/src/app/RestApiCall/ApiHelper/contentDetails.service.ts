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
export class ContentDetailsApiHelper {

  constructor(public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getVideo(url: string): Observable<any> {
    return this.http.getArrayBufferFile(url).pipe(map((res: any) => res), catchError((error: HttpErrorResponse) => throwError(error.error)));
  }

  getContentDetails(contentData: any): Observable<any> {

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

    return this.http.post(appApiResources.contentDetails, contentData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getVideoData(vimeoId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + environment.vimeoApiKey);

    return this.http.get('https://api.vimeo.com/videos/' + vimeoId, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

}
