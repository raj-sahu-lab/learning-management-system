import { Injectable, } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class loginApiHelper {

  constructor(public http: BaseService, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) {}

  login(loginData: any): Observable<any> {

    return this.http.post(appApiResources.login, loginData, null).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );
    
  }

}
