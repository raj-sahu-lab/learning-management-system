import { Injectable } from '@angular/core';
import { TostNotificationService } from './toast-notification.service';

@Injectable()
export class CustomErrorHandlerService {
  constructor(public snotify: TostNotificationService) { }

  tryParseError(error): any {
    try {
      return error.json();
    } catch (ex) {
      try {
        return error;
      } catch (ex) {
        return error.toString();
      }
    }
  }

  parseCustomServerErrorToString(error: Error): string {
    this.showToast(error);

    const parsedError = {};
    try {
      return JSON.stringify(this.tryParseError(parsedError));
    } catch (ex) {
      try {
        return error.toString();
      } catch (error) {
        return error.toString();
      }
    }
  }



  // createCustomError(error: Error): HttpResponse {
  //   try {

  //     const responseOptions = new HttpResponse({
  //       body: { error: { title: 'TOA', message:  error.message } },
  //       status: 400,
  //       headers: null,
  //       url: null,
  //     });
  //     return responseOptions;
  //   } catch (ex) {
  //     const responseOptions = new HttpResponse({
  //       body: { title: 'Unknown Error!', message: 'Unknown Error Occurred.' },
  //       status: 400,
  //       headers: null,
  //       url: null,
  //     });
  //     return responseOptions;
  //   }
  // }

  showToast(error: Error): void {

    this.snotify.body = error.message;
    this.snotify.bodyMaxLength = 100;
    this.snotify.onError();
  }

}
