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

            // Courses
            // tslint:disable-next-line:max-line-length
            { path: 'subject', loadChildren: () => import('./courses/subject/subject.module').then(m => m.SubjectModule) },
            { path: 'topic', loadChildren: () => import('./courses/topic/topic.module').then(m => m.TopicModule) },
            { path: 'content', loadChildren: () => import('./courses/content/content.module').then(m => m.ContentModule) },            
            { path: 'pdf', loadChildren: () => import('./courses/pdf/pdf.module').then(m => m.PdfModule) },
            { path: 'ppt', loadChildren: () => import('./courses/ppt/ppt.module').then(m => m.PptModule) },
            { path: 'audio', loadChildren: () => import('./courses/audio/audio.module').then(m => m.AudioModule) },
            { path: 'video', loadChildren: () => import('./courses/video/video.module').then(m => m.VideoModule) },
            { path: 'tutor', loadChildren: () => import('./courses/tutor/tutor.module').then(m => m.TutorModule) },
           
             // TEST
             { path: 'test', loadChildren: () => import('./test/test/test.module').then(m => m.TestModule) },
             { path: 'practice', loadChildren: () => import('./test/practice/practice.module').then(m => m.PracticeModule) },
             { path: 'paper', loadChildren: () => import('./test/paper/paper.module').then(m => m.PaperModule) },
             { path: 'question', loadChildren: () => import('./test/question/question.module').then(m => m.QuestionModule) },
             { path: 'series', loadChildren: () => import('./test/series/series.module').then(m => m.SeriesModule) },
             { path: 'set', loadChildren: () => import('./test/set/set.module').then(m => m.SetModule) },
             { path: 'bundle', loadChildren: () => import('./test/bundle/bundle.module').then(m => m.BundleModule) },             
             
            // MARKETING
            { path: 'sms', loadChildren: () => import('./marketing/sms/sms.module').then(m => m.SmsModule) },
            { path: 'email', loadChildren: () => import('./marketing/email/email.module').then(m => m.EmailModule) },
            { path: 'notification', loadChildren: () => import('./marketing/notification/notification.module').then(m => m.NotificationModule) },
            { path: 'notifications', loadChildren: () => import('./marketing/notifications/notifications.module').then(m => m.NotificationsModule) }, // Get Notification send by SA Panel
            { path: 'coupon', loadChildren: () => import('./marketing/coupon/coupon.module').then(m => m.CouponModule) },
            { path: 'newsCategory', loadChildren: () => import('./marketing/news-category/news-category.module').then(m => m.NewsCategoryModule) },
            { path: 'news', loadChildren: () => import('./marketing/news/news.module').then(m => m.NewsModule) },
            { path: 'emailSMSplan/:id', loadChildren: () => import('./marketing/email-smsplan/email-smsplan.module').then(m => m.EmailSMSplanModule) },
           
            // COMMUNICATE
            { path: 'polls', loadChildren: () => import('./communicate/polls/polls.module').then(m => m.PollsModule) },
            { path: 'forum', loadChildren: () => import('./communicate/forum/forum.module').then(m => m.ForumModule) },
            { path: 'forum/category', loadChildren: () => import('./communicate/forum-category/forum-category.module').then(m => m.ForumCategoryModule) },
            { path: 'forum/subject', loadChildren: () => import('./communicate/forum-subject/forum-subject.module').then(m => m.ForumSubjectModule) },
            { path: 'forum/articles', loadChildren: () => import('./communicate/forum-articles/forum-articles.module').then(m => m.ForumArticlesModule) },
            { path: 'forum/topic', loadChildren: () => import('./communicate/forum-topic/forum-topic.module').then(m => m.ForumTopicModule) },
            { path: 'forumDiscussion/:id', loadChildren: () => import('./communicate/forum-discussion/forum-discussion.module').then(m => m.ForumDiscussionModule) },
            { path: 'reviews', loadChildren: () => import('./communicate/reviews/reviews.module').then(m => m.ReviewsModule) },
            { path: 'support', loadChildren: () => import('./communicate/support/support.module').then(m => m.SupportModule) },
            { path: 'supportChat/:id', loadChildren: () => import('./communicate/support-chat/support-chat.module').then(m => m.SupportChatModule) },
            { path: 'normalChat', loadChildren: () => import('./communicate/normal-chat/normal-chat.module').then(m => m.NormalChatModule) },
    
            // ADMISSION AND FEE
            { path: 'learner', loadChildren: () => import('./learners/learner/learner.module').then(m => m.LearnerModule) },
            { path: 'fees', loadChildren: () => import('./learners/fees/fees.module').then(m => m.FeesModule) },
            { path: 'feesDetails', loadChildren: () => import('./learners/fees-details/fees-details.module').then(m => m.FeesDetailsModule) },
            { path: 'results', loadChildren: () => import('./learners/results/results.module').then(m => m.ResultsModule) },
                        
            // Live Class
            { path: 'userCreate', loadChildren: () => import('./../layout/classes/user-create/user-create.module').then(m => m.UserCreateModule) },
            { path: 'liveClass', loadChildren: () => import('./../layout/classes/student-class/student-class.module').then(m => m.StudentClassModule) },
            { path: 'zoomCredential', loadChildren: () => import('./../layout/classes/zoom-credential/zoom-credential.module').then(m => m.ZoomCredentialModule) },
            { path: 'createGroup', loadChildren: () => import('./../layout/classes/group-create/group-create.module').then(m => m.GroupCreateModule) },
            
            // Reports
            { path: 'admission', loadChildren: () => import('./reports/admission/admission.module').then(m => m.AdmissionModule) },
            { path: 'testResult', loadChildren: () => import('./reports/test-result/test-result.module').then(m => m.TestResultModule) },

            // Settings
            { path: 'setting', loadChildren: () => import('./profile/setting/setting.module').then(m => m.SettingModule) },
            { path: 'helpSupport', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
            { path: 'logo', loadChildren: () => import('./profile/logo/logo.module').then(m => m.LogoModule) },
            { path: 'branch', loadChildren: () => import('./profile/branch/branch.module').then(m => m.BranchModule) },
            { path: 'social', loadChildren: () => import('./profile/social/social.module').then(m => m.SocialModule) },
            { path: 'password', loadChildren: () => import('./profile/password/password.module').then(m => m.PasswordModule) },
            { path: 'paymentgateway', loadChildren: () => import('./profile/paymentgateway/paymentgateway.module').then(m => m.PaymentgatewayModule) },
            { path: 'primaryCurrency', loadChildren: () => import('./profile/primary-currency/primary-currency.module').then(m => m.PrimaryCurrencyModule) },
            { path: 'aboutus', loadChildren: () => import('./profile/aboutus/aboutus.module').then(m => m.AboutusModule) },
            { path: 'privacypolicies', loadChildren: () => import('./profile/privacypolicies/privacypolicies.module').then(m => m.PrivacypoliciesModule) },
            { path: 'invoice', loadChildren: () => import('./profile/invoice/invoice.module').then(m => m.InvoiceModule) },
            { path: 'timeZone', loadChildren: () => import('./profile/time-zone/time-zone.module').then(m => m.TimeZoneModule) },
            { path: 'domain', loadChildren: () => import('./profile/domain/domain.module').then(m => m.DomainModule) },
            { path: 'thirdPartyIntegration', loadChildren: () => import('./profile/third-party-integration/third-party-integration.module').then(m => m.ThirdPartyIntegrationModule) },

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
