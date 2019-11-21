import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { BaseService } from '../NetworkLayer/base.service';
import { Subject, ReplaySubject, Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { DOCUMENT } from '@angular/common';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentGateWayService {

  private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, @Inject(DOCUMENT) private document: Document, public http: BaseService, public errorHandler: CustomErrorHandlerService) { }

  lazyLoadLibrary(resourceURL): Observable<any> {
    
    return forkJoin([
        this.loadScript(resourceURL)
    ]); 
  }

  private loadScript(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
        return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.onload = () => {
        this._loadedLibraries[url].next();
        this._loadedLibraries[url].complete();
    };

    this.document.body.appendChild(script);    
    return this._loadedLibraries[url].asObservable();
  }  

  //to pass paypal payment data to payment gateway component
  private _invokePayement = new Subject<any>();

  getPaymentDetails(): Observable<any> {
    return this._invokePayement.asObservable();
  }

  sendPayementdetails(paymentDetails: any) {
    this._invokePayement.next(paymentDetails);
  }

  //on close of payment module set payment button false
  private _invokePayementModalClose = new Subject<any>();

  closePayementModle(): Observable<any> {
    return this._invokePayementModalClose.asObservable();
  }

  sendPayementModleStatus() {
    this._invokePayementModalClose.next();
  }

  placePurchaseorder( purchaseDetails : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    
    return this.http.post(appApiResources.purchase, purchaseDetails, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );

  }

  stripePurchaseorder( purchaseDetails : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));

    return this.http.post(appApiResources.stripePurchase, purchaseDetails, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );

  }

  getPurchaseOrderList() : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Cache-Control', 'no-cache');
    headers = headers.set('Pragma', 'no-cache');
    
    return this.http.get(appApiResources.purchase, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );

  }

  checkCoupon( couponDetails : any) : Observable<any> {
    
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.storage.get('bearer_token'));
    headers = headers.set('Content-Type', 'application/json');
    
    return this.http.post(appApiResources.checkCoupon, couponDetails, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error))
    );

  }
  
}
