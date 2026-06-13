import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { appApiResources } from './app.constants';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomepageHelper {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, public http: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getDashboardData(): Observable<any> {
    
    let headers = new HttpHeaders();
    if(!this.storage.get('isLogedIn')){
      
      // headers = headers.set('domain', environment.baseUrl);
      headers = headers.set('domain', window.location.hostname);
      // headers = headers.set('domain', "dev.your-saas-domain.example.com");
      // headers = headers.set('domain',"online.example.com");

    } else {
      headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    }
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');

    return this.http.get(appApiResources.home, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getAboutUs(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    return this.http.get(appApiResources.about, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  logIn(userData) {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Content-Type', 'application/json');

    return this.http.post(appApiResources.login, userData, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );

  }

  getContact(){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');

    return this.http.get(appApiResources.contact, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getTerms(): Observable<any> {
    let headers = new HttpHeaders();
    // headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');

    return this.http.get(appApiResources.terms, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

  getPrivacy(): Observable<any> {
    let headers = new HttpHeaders();
    // headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    
    return this.http.get(appApiResources.privacy, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
  }

}
