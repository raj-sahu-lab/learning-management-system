import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/guard/';
import { BaseService } from './RestApiCall/NetworkLayer/base.service';
import { CustomErrorHandlerService } from './RestApiCall/NetworkLayer/custom-error-handler.service';
import { TostNotificationService } from './RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from './RestApiCall/NetworkLayer/helper.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { PushNotificationService } from './RestApiCall/ApiHelper/push-notification.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgxStripeModule } from 'ngx-stripe';

const config: SocketIoConfig = { url: environment.chatSocket, options: {} };

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      FormsModule,
      CommonModule,
      HttpClientModule,
      BrowserModule,
      AppRoutingModule,
      SnotifyModule,
      NgxUiLoaderModule,
      CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
      BrowserAnimationsModule,
      NgxPayPalModule,
      NgxDocViewerModule,
      ToastrModule.forRoot(),
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireMessagingModule,
      AngularFireModule.initializeApp(environment.firebase),
      SocketIoModule.forRoot(config),
      NgxStripeModule.forRoot()
   ],
   providers: [
      AuthGuard,
      BaseService,
      CustomErrorHandlerService,
      TostNotificationService,
      HelperService,
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService,
      PushNotificationService,
      AsyncPipe,
      NgxImageCompressService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
