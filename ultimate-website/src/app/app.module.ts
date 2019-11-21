import { BrowserModule,Title  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BaseService } from './RestApiCall/NetworkLayer/base.service';
import { CustomErrorHandlerService } from './RestApiCall/NetworkLayer/custom-error-handler.service';
import { TostNotificationService } from './RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from './RestApiCall/NetworkLayer/helper.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { StorageServiceModule} from 'ngx-webstorage-service';
import { NgxPayPalModule } from 'ngx-paypal';
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseComponent } from './course/course.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { TermsandconditionComponent } from './termsandcondition/termsandcondition.component';
import { FaqComponent } from './faq/faq.component';
import { SubjectDetailsComponent } from './subject-details/subject-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PaymentGateWayComponent } from './payment-gate-way/payment-gate-way.component';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      FooterComponent,
      DashboardComponent,
      CourseComponent,
      ContactComponent,
      AboutComponent,
      LoginComponent,
      RegisterComponent,
      TermsandconditionComponent,
      FaqComponent,
      SubjectDetailsComponent,
      ForgotPasswordComponent,
      PaymentGateWayComponent,
      PrivacyPoliciesComponent,
   ],
   imports: [
      FormsModule,
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      SnotifyModule,
      NgxUiLoaderModule,
      StorageServiceModule,
      NgxPayPalModule,
      ToastrModule.forRoot(),
      ClipboardModule,
      NgxStripeModule.forRoot(),
   ],
   providers: [
      Title,
      BaseService,
      CustomErrorHandlerService,
      TostNotificationService,
      HelperService,
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService,
      AsyncPipe
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
