import { Injectable, ErrorHandler, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Injectable()
export class BaseService {

    constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private http: HttpClient, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

    getArrayBufferFile(url: string) {

        const options = { responseType: 'Blob' as 'json'};
        return this.http.get(url, options).pipe(
            map((res: Response) => res),
            catchError((error: Response) => { return throwError(error) }),
            finalize(() => { this.helperService.stopLoader(); })
        );
    }
    
    get(url, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.get(url, { headers: header }).pipe(
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        // this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                finalize(() => { this.helperService.stopLoader(); })
            );
        } else {

            return this.http.get(url).pipe(
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                finalize(() => { this.helperService.stopLoader(); })
            );
        }

    }

    post(url, postBody: any, header: HttpHeaders) {

        this.helperService.startLoader();
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postBody), environment.en_key).toString();

        if (header) {

            return this.http.post(url, {data: ciphertext}, { headers: header }).pipe(
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.post(url, {data: ciphertext}).pipe(
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    put(url, postBody: any, header: HttpHeaders) {

        this.helperService.startLoader();
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postBody), environment.en_key).toString();

        if (header) {

            return this.http.put(url, {data: ciphertext}, { headers: header }).pipe(
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.put(url, {data: ciphertext}).pipe(
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
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
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.delete(url).pipe(
                map((res: any) => {
                    var resJson = this.decrypt(res.data);
                    return resJson;
                }),
                catchError((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['/access-denied']);
                        this.storage.clear();
                    }
                    error.error = this.decrypt(error.error.data);
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    decrypt(data){
        var bytes  = CryptoJS.AES.decrypt(data, environment.en_key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(originalText);
    }

    postWithoutEncrypt(url, postBody: any, header: HttpHeaders) {

        this.helperService.startLoader();
        if (header) {

            return this.http.post(url, postBody, { headers: header }).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status === 401) {
                        this.router.navigate(['']);
                        localStorage.clear();
                    }
                    return throwError(error);
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

                        this.router.navigate(['']);
                        localStorage.clear();
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }
}
