import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
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