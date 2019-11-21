import { User } from './model.interface';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";

function getWindow(): any {
  return window;
}

@Injectable()
export class HelperService {

  env: string;

  constructor(private ngxService: NgxUiLoaderService) {
    this.env = 'dev';
  }

  //to set accout info in headder
  private _invokeAccount = new Subject<any>();

  listenAccout(): Observable<any> {
    return this._invokeAccount.asObservable();
  }

  account() {
    this._invokeAccount.next();
  }

  //on logout call course api
  private _invokeLogout = new Subject<any>();

  listenLogout(): Observable<any> {
    return this._invokeLogout.asObservable();
  }

  logOut() {
    this._invokeLogout.next();
  }

  // return the global window object
  get nativeWindow(): any {
    return getWindow();
  }


  isProdEnv(): boolean {
    return (this.env.toLocaleLowerCase() === 'prod' ||
      this.env.toLocaleLowerCase() === 'production') ? true : false;
  }
  isStageEnv(): boolean {
    return (this.env.toLocaleLowerCase() === 'prod' ||
      this.env.toLocaleLowerCase() === 'production') ? true : false;
  }
  isDevEnv(): boolean {
    return (this.env.toLocaleLowerCase() === 'dev' ||
      this.env.toLocaleLowerCase() === 'development') ? true : false;
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


}
