import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { BaseService } from './RestApiCall/NetworkLayer/base.service';
import { CustomErrorHandlerService } from './RestApiCall/NetworkLayer/custom-error-handler.service';
import { TostNotificationService } from './RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from './RestApiCall/NetworkLayer/helper.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule } from  'ngx-ui-loader';

@NgModule({
   imports: [
      FormsModule,
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      LanguageTranslationModule,
      AppRoutingModule,
      SnotifyModule,
      NgxUiLoaderModule,
   ],
   declarations: [
      AppComponent,
   ],
   providers: [
      AuthGuard,
      BaseService,
      CustomErrorHandlerService,
      TostNotificationService,
      HelperService,
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
