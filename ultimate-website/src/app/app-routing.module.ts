import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseComponent } from '../app/course/course.component';
import { AboutComponent } from '../app/about/about.component';
import { ContactComponent } from '../app/contact/contact.component';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { TermsandconditionComponent } from './termsandcondition/termsandcondition.component';
import { FaqComponent } from './faq/faq.component';
import { SubjectDetailsComponent } from './subject-details/subject-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CourseComponent },
      { path: 'course', component: CourseComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'termsAndCondition', component: TermsandconditionComponent },
      { path: 'privacyPolicies', component: PrivacyPoliciesComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'subject', component: SubjectDetailsComponent },
      { path: '**', redirectTo: '' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }