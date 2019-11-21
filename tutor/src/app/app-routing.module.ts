import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';


const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    // tslint:disable-next-line:max-line-length
    { path: 'planPurchase/:token/:title', loadChildren: () => import('./plan-purchase/plan-purchase.module').then(m => m.PlanPurchaseModule) },
    { path: 'forgotpassword', loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordModule) },
    { path: 'changepassword/:token', loadChildren: () => import('./changepassword/changepassword.module').then(m => m.ChangepasswordModule) },
    { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule) },
    { path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
    { path: 'liveClassStart', loadChildren: () => import('./student-class-start/student-class-start.module').then(m => m.StudentClassStartModule) },
    { path: 'liveClassStartZoom', loadChildren: () => import('./student-class-start-zoom/student-class-start-zoom.module').then(m => m.StudentClassStartZoomModule) },
    { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: '**', redirectTo: 'not-found' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
