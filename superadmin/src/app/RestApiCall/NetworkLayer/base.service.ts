import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';

@Injectable()
export class BaseService {

    // tslint:disable-next-line:max-line-length
    constructor(private http: HttpClient, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

    get(url, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.get(url, { headers: header }).pipe(
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                map((res: Response) => res),
                finalize(() => { this.helperService.stopLoader(); })
            );
        } else {

            return this.http.get(url).pipe(
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                map((res: Response) => res),
                finalize(() => { this.helperService.stopLoader(); })
            );
        }

    }

    post(url, postBody: any, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.post(url, postBody, { headers: header }).pipe(
                map((res: Response) => res),                
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.post(url, postBody).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {

                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    put(url, postBody: any, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.put(url, postBody, { headers: header }).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.put(url, postBody).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    deleted(url, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.delete(url, { headers: header }).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {

                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.delete(url).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }
}
