import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { v4 as uuidv4 } from 'uuid'; // for change password logout all device
import CryptoJS from 'crypto-js';
// Post data is no encript , only get data decrypt

@Injectable()
export class BaseService {

    constructor(private http: HttpClient, public router: Router, public helperService: HelperService, public errorHandler: CustomErrorHandlerService) { }

    getWithoutEncript(url, header: HttpHeaders) {
        
        this.helperService.startLoader();
        if(header){
            header = header.set('device_id', localStorage.getItem('device_id'));

        } else {
            header = new HttpHeaders();
            header = header.set('device_id', localStorage.getItem('device_id'));
        }
        
        if (header) {

            return this.http.get(url, { headers: header }).pipe(
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                map((res: Response) => res),
                finalize(() => { this.helperService.stopLoader(); })
            );
        } else {
            
            return this.http.get(url).pipe(
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                map((res: Response) => res),
                finalize(() => { this.helperService.stopLoader(); })
            );
        }
    }

    postWithoutEncrypt(url, postBody: any, header: HttpHeaders) {
       
        this.helperService.startLoader();
        if(header){
            if(localStorage.getItem('device_id')){
                header = header.set('device_id', localStorage.getItem('device_id'));
            }

        } else {
            
            if(localStorage.getItem('device_id')){
                header = new HttpHeaders();
                header = header.set('device_id', localStorage.getItem('device_id'));
            }

        }

        if (header) {

            return this.http.post(url, postBody, { headers: header }).pipe(
                map((res: Response) => res),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
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
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    get(url, header: HttpHeaders) {
        
        this.helperService.startLoader();
        if(header) {
            header = header.set('device_id', localStorage.getItem('device_id'));

        } else {
            header = new HttpHeaders();
            header = header.set('device_id', localStorage.getItem('device_id'));
        }
        
        if (header) {

            return this.http.get(url, { headers: header }).pipe(
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),//this.decrypt(res)
                finalize(() => { this.helperService.stopLoader(); })
            );
        } else {
            
            return this.http.get(url).pipe(
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                finalize(() => { this.helperService.stopLoader(); })
            );
        }

    }

    post(url, postBody: any, header: HttpHeaders) {
       
        //let encryptedData = {data : this.encrypt(postBody)};
        
        this.helperService.startLoader();
        if(header){
            if(localStorage.getItem('device_id')){
                header = header.set('device_id', localStorage.getItem('device_id'));
            }

        } else {
            
            if(localStorage.getItem('device_id')){
                header = new HttpHeaders();
                header = header.set('device_id', localStorage.getItem('device_id'));
            }

        }

        if (header) {
            
            return this.http.post(url, postBody, { headers: header }).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.post(url, postBody).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    put(url, postBody: any, header: HttpHeaders) {

        //let encryptedData = {data : this.encrypt(postBody)};

        this.helperService.startLoader();
        if(header){
            header = header.set('device_id', localStorage.getItem('device_id'));

        } else {
            header = new HttpHeaders();
            header = header.set('device_id', localStorage.getItem('device_id'));
        }

        if (header) {

            return this.http.put(url, postBody, { headers: header }).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.put(url, postBody).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
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
        if(header){
            header = header.set('device_id', localStorage.getItem('device_id'));

        } else {
            header = new HttpHeaders();
            header = header.set('device_id', localStorage.getItem('device_id'));
        }
        
        if (header) {

            return this.http.delete(url, { headers: header }).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    // return Observable.throw(this.errorHandler.tryParseError(error));
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );

        } else {

            return this.http.delete(url).pipe(
                map((res: Response) => {
                    if(environment.encryptDecryptResponse){
                        return this.decrypt(res);
                    } else {
                        return res;
                    }
                }),
                catchError((error: Response) => {
                    if (error.status == 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }),
                finalize(() => {

                    this.helperService.stopLoader();
                })
            );
        }

    }

    decrypt(getData) {

        if(getData) {
            var bytes  = CryptoJS.AES.decrypt(getData.data, environment.encryptionKey);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(originalText);
        }
    }

    encrypt(postBody){
        let encryData = CryptoJS.AES.encrypt(JSON.stringify(postBody), environment.encryptionKey).toString();
        return encryData;
    }
}
