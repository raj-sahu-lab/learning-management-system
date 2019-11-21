import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard';

const routes: Routes = [

  // tslint:disable-next-line:max-line-length
  { path: 'verify/:id', loadChildren: () => import('./authenticationanderror/verifiy/verifiy.module').then(m => m.VerifiyModule) },
  { path: '', loadChildren: () => import('./authenticationanderror/login/login.module').then(m => m.LoginModule) , canActivate: [AuthGuard] },
  { path: 'forgetPassword', loadChildren: () => import('./authenticationanderror/forget-password/forget-password.module').then(m => m.ForgetPasswordModule) },
  { path: 'register', loadChildren: () => import('./authenticationanderror/register/register.module').then(m => m.RegisterModule) },
  { path: 'addInstitute', loadChildren: () => import('./authenticationanderror/add-institute/add-institute.module').then(m => m.AddInstituteModule) },
  { path: 'termscondition', loadChildren: () => import('./authenticationanderror/termscondition/termscondition.module').then(m => m.TermsconditionModule) },
  
  { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule) },
  { path: 'liveClass/zoom', loadChildren: () => import('./zoom-class/zoom-class.module').then(m => m.ZoomClassModule) },
  { path: 'liveClass/blueJeance', loadChildren: () => import('./blue-jeance-class/blue-jeance-class.module').then(m => m.BlueJeanceClassModule) },
  
  { path: 'error', loadChildren: () => import('./authenticationanderror/server-error/server-error.module').then(m => m.ServerErrorModule) },
  { path: 'access-denied', loadChildren: () => import('./authenticationanderror/access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
  { path: 'not-found', loadChildren: () => import('./authenticationanderror/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }