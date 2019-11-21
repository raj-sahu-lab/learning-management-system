import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'password', loadChildren: () => import('./password/password.module').then(m => m.PasswordModule) },

            // Plan And Terms
            { path: 'institute', loadChildren: () => import('./Institute/institute.module').then(m => m.InstituteModule) },
            { path: 'education', loadChildren: () => import('./education/education.module').then(m => m.EducationModule) },
            { path: 'curreny', loadChildren: () => import('./curreny/curreny.module').then(m => m.CurrenyModule) },

            { path: 'term', loadChildren: () => import('./PlanAndTerms/term/term.module').then(m => m.TermModule) },
            { path: 'plan', loadChildren: () => import('./PlanAndTerms/plan/plan.module').then(m => m.PlanModule) },
            { path: 'plandetail', loadChildren: () => import('./PlanAndTerms/plandetail/plandetail.module').then(m => m.PlandetailModule) },
            { path: 'emailSMSplan', loadChildren: () => import('./PlanAndTerms/email-smsplan/email-smsplan.module').then(m => m.EmailSMSPlanModule) },

            { path: 'smsSend', loadChildren: () => import('./Marketing/sms-send/sms-send.module').then(m => m.SmsSendModule) },
            { path: 'sms', loadChildren: () => import('./Marketing/sms/sms.module').then(m => m.SmsModule) },
            { path: 'smsHistory', loadChildren: () => import('./Marketing/sms-history/sms-history.module').then(m => m.SmsHistoryModule) },
            { path: 'smsStatement/:id', loadChildren: () => import('./Marketing/sms-statement/sms-statement.module').then(m => m.SmsStatementModule) },
            { path: 'email', loadChildren: () => import('./Marketing/email/email.module').then(m => m.EmailModule) },
            { path: 'emailHistory', loadChildren: () => import('./Marketing/email-history/email-history.module').then(m => m.EmailHistoryModule) },
            { path: 'emailStatement/:id', loadChildren: () => import('./Marketing/email-statement/email-statement.module').then(m => m.EmailStatementModule) },
            { path: 'emailTemplate', loadChildren: () => import('./Marketing/email-template/email-template.module').then(m => m.EmailTemplateModule) },
            { path: 'offer', loadChildren: () => import('./Marketing/offer/offer.module').then(m => m.OfferModule) },
            { path: 'notification', loadChildren: () => import('./Marketing/notification/notification.module').then(m => m.NotificationModule) },

            { path: 'student/:id', loadChildren: () => import('./reports/student/student.module').then(m => m.StudentModule) },
            { path: 'tutor/:id', loadChildren: () => import('./reports/tutor/tutor.module').then(m => m.TutorModule) },

            { path: 'menu', loadChildren: () => import('./menu/menu/menu.module').then(m => m.MenuModule) },
            { path: 'submenu', loadChildren: () => import('./menu/submenu/submenu.module').then(m => m.SubmenuModule) },

            { path: 'iOSPurchase', loadChildren: () => import('./iospurchase/iospurchase.module').then(m => m.IOSPurchaseModule) },

            // Othere
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
