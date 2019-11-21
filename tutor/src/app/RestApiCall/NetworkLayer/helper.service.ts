import { User } from './model.interface';
import { Injectable, Inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;
import { ReplaySubject, Observable, throwError, forkJoin } from 'rxjs';
import { DOCUMENT } from '@angular/common';

function getWindow(): any {
  return window;
}

@Injectable()
export class HelperService {

  env: string;
  private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(DOCUMENT) private document: Document, private ngxService: NgxUiLoaderService) {
    this.env = 'dev';
  }

  // return the global window object
  get nativeWindow(): any {
    return getWindow();
  }


  isProdEnv(): boolean {
    return (this.env.toLocaleLowerCase() == 'prod' ||
      this.env.toLocaleLowerCase() == 'production') ? true : false;
  }
  isStageEnv(): boolean {
    return (this.env.toLocaleLowerCase() == 'prod' ||
      this.env.toLocaleLowerCase() == 'production') ? true : false;
  }
  isDevEnv(): boolean {
    return (this.env.toLocaleLowerCase() == 'dev' ||
      this.env.toLocaleLowerCase() == 'development') ? true : false;
  }

  /**
   * Use this method to create logs to the server
   * Pass info like error stack (if error), user info, user brower and other details
   */
  serverLogger(log: any) {
    // tslint:disable-next-line:no-console

  }

  secondsTicksCounter(): object {
    let seconds = 0;
    // tslint:disable-next-line:prefer-const
    let interval;
    return {
      start: () => {
        return setInterval(function () {
          seconds++;
        }, 1000);
      },
      stop: (intervalInstance: any) => {
        clearInterval(intervalInstance);
        return seconds;
      },
      intervalInstance: null,
    };
  }


  deleteAllCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  getUserFromLocalStorage(): User {
    const user = localStorage.getItem('userResponse');
    return <User>JSON.parse(user);
  }

  getUserRole(): string {
    const user: User = this.getUserFromLocalStorage();
    return (user) ? user.roleNames[0] : null;
  }

  isUserLoggedIn(): boolean {
    const user = localStorage.getItem('userResponse');
    return (user && user.length > 0) ? true : false;
  }


  redirectToLogin() {

  }

  initFormControls(self: object, formGroup: FormGroup, controlNames: string[]): void {
    for (const controlName of controlNames) {
      self[controlName] = formGroup.controls[controlName];
    }
  }

  showCompareCtrlsValidationMsg(frmGroup: FormGroup, ctrl1: AbstractControl, ctrl2: AbstractControl): boolean {
    return (frmGroup && !frmGroup.valid && (ctrl1.touched || ctrl1.touched)) ? true : false;
  }

  showCtrlValidationMsg(formControl: AbstractControl): boolean {
    return (formControl && !formControl.valid && formControl.touched && formControl.errors) ? true : false;
  }


  startLoader(delay?: number): void {

    this.ngxService.start();
  }

  stopLoader(delay?: number): void {

    this.ngxService.stop();
  }

  loadDataTable() {
    
    $('.js-exportable').DataTable().destroy();

    setTimeout(() => {
      $('.js-basic-example').DataTable();

      // Exportable table
      var table;
      if ( !($.fn.dataTable.isDataTable( '.js-exportable' )) ) {
        table = $('.js-exportable').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
        });
      }

      return ;
    }, 500);
  }

  // to load external script
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

  // end load external script

  startload(){
    document.getElementById('showLoadingId').style.display = 'block';
  }

  stopLoad(){
    document.getElementById('showLoadingId').style.display = 'none';
  }
  
}
