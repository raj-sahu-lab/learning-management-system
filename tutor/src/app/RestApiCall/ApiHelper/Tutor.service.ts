import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';

@Injectable({ providedIn: 'root' })
export class TutorApiHelper {

  constructor(public baseService: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

  getTutorList(isSubject: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');
    
    return this.baseService.get(appApiResources.tutor+"/"+isSubject, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  addTutor(image: any,tutor: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
 
    const formData = new FormData();

    if (image != null) {

      formData.append('image', image);
    }
    
    for (const key in tutor) {

      let value = tutor[key];
      if (value != null) {
        formData.append(key, value);
      }
    }

    return this.baseService.post(appApiResources.tutor, formData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  } 

  updateTutor(image: any,tutor: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));

    const formData = new FormData();

    if (image != null) {

      formData.append('image', image);
    }

    for (const key in tutor) {

      let value = tutor[key];
      if (value != null) {
        formData.append(key, value);
      }
    }
    
    return this.baseService.put(appApiResources.tutor, formData, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }

  deleteTutor(tutorId: number): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    
    return this.baseService.deleted(appApiResources.tutor+"/"+tutorId, headers).pipe(
        map((res: Response) => res),
        catchError((error: HttpErrorResponse) => throwError(error.error))
      );
  }
}
