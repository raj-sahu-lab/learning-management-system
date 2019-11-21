import { Injectable } from '@angular/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TostNotificationService  {

  style = 'material';
  title = '';
  body = '';
  timeout = 2000;
  position: SnotifyPosition = SnotifyPosition.rightTop;
  progressBar = false;
  closeClick = true;
  newTop = true;
  filterDuplicates = true;
  backdrop = -1;
  dockMax = 8;
  blockMax = 6;
  pauseHover = true;
  titleMaxLength = 15;
  bodyMaxLength = 80;

  confirmBox: Observable<any>;
  constructor(public snotifyService: SnotifyService) {}

  /*
  Change global configuration
   */
  getConfig(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: this.newTop,
        maxAtPosition: this.blockMax,
        maxOnScreen: this.dockMax
        }
    });
    return {
      bodyMaxLength: this.bodyMaxLength,
      titleMaxLength: this.titleMaxLength,
      backdrop: this.backdrop,
      position: this.position,
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover,
      iconClass: 'snofyicon'
    };
  }

  clear() {

    this.snotifyService.clear();
  }
  onSuccess() {
    this.snotifyService.success(this.body, this.title, this.getConfig());
  }
  onInfo() {

    this.snotifyService.info(this.body, this.title, this.getConfig());
  }
  onError() {

    this.snotifyService.error(this.body, this.title, this.getConfig());
  }
  onWarning() {

    this.snotifyService.warning(this.body, this.title, this.getConfig());
  }
  onSimple() {

    // const icon = `assets/custom-svg.svg`;
    const icon = `https://placehold.it/48x100`;

    this.snotifyService.simple(this.body, this.title, {
      ...this.getConfig(),
      icon: icon
    });
  }

  onAsyncLoading(observable: Observable<any>) {

    const id = this.snotifyService.async(this.title, this.body,
      /*
      You should pass Promise or Observable of type SnotifyConfig to change some data or do some other actions
      More information how to work with observables:
      https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md
       */

      // new Promise((resolve, reject) => {
      //   setTimeout(() => reject(), 1000);
      //   setTimeout(() => resolve(), 1500);
      // })
      Observable.create(observer => {
        observer.next({
          body: 'Processing...',
        });
        observable.subscribe(
          (success: any) => observer.complete(),
          (error: any) => observer.complete(),
          () => {
            setTimeout(() => {
              observer.complete();
            //   this.snotifyService.remove(id);
            }, 1000);
          });
      },
      ),
    );
  }

  onConfirmation() {


    this.confirmBox = new Observable(observer => {

      /*
         Here we pass an buttons array, which contains of 2 element of type SnotifyButton
          */
      const id = this.snotifyService.confirm(this.body, this.title, {
        timeout: this.timeout,
        showProgressBar: this.progressBar,
        closeOnClick: this.closeClick,
        pauseOnHover: this.pauseHover,
        buttons: [
          // tslint:disable-next-line:no-console
          { text: 'Yes', action: (toast) => { observer.next(); this.snotifyService.remove(toast.id); }, bold: false },
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:no-console
          { text: 'No', action: (toast) => { observer.error(); this.snotifyService.remove(toast.id); }, bold: true },
        ],
      });
    });
  }

  onPrompt() {
    /*
     Here we pass an buttons array, which contains of 2 element of type SnotifyButton
     At the action of the first button we can get what user entered into input field.
     At the second we can't get it. But we can remove this toast
     */
    const id = this.snotifyService.prompt(this.title, this.body, {
      timeout: this.timeout,
      showProgressBar: this.progressBar,
      closeOnClick: this.closeClick,
      pauseOnHover: this.pauseHover,
      buttons: [
        // tslint:disable-next-line:no-console
        { text: 'Yes', action: (toast) => console.log(`Said Yes: ${toast.value}`) },
        // tslint:disable-next-line:no-console
        { text: 'No', action: (toast) => { console.log(`Said No: ${toast.value}`); this.snotifyService.remove(toast.id); } },
      ],
      placeholder: 'This is the example placeholder which you can pass', // Max-length = 40
    });
  }


  onClear() {
    this.snotifyService.clear();
  }


}
