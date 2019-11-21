import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { BaseService } from '../RestApiCall/NetworkLayer/base.service';
import { CustomErrorHandlerService } from '../RestApiCall/NetworkLayer/custom-error-handler.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        SnotifyModule
    ],
    providers: [
        BaseService,
        CustomErrorHandlerService,
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
