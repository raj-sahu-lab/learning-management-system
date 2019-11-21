import { BrowserModule } from '@angular/platform-browser';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AuthGuard } from './shared';
import { BaseService } from './RestApiCall/NetworkLayer/base.service';
import { CustomErrorHandlerService } from './RestApiCall/NetworkLayer/custom-error-handler.service';
import { TostNotificationService } from './RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from './RestApiCall/NetworkLayer/helper.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule } from  'ngx-ui-loader';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './shared/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { KatexModule } from 'ng-katex';
import { NgxImageCompressService } from 'ngx-image-compress';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.chatSocket, options: {} };

@NgModule({
   imports: [
      SocketIoModule.forRoot(config),
      FormsModule,
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      LanguageTranslationModule,
      AppRoutingModule,
      SnotifyModule,
      NgxUiLoaderModule,
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireMessagingModule,
      AngularFireModule.initializeApp(environment.firebase),
      KatexModule
   ],
   declarations: [
      AppComponent
   ],
   providers: [
      BnNgIdleService,
      AuthGuard,
      BaseService,
      CustomErrorHandlerService,
      TostNotificationService,
      HelperService,
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService,
      MessagingService,
      AsyncPipe,
      NgxImageCompressService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}