import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { HeaderComponent } from '../layout/header/header.component';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubjectComponent } from './subject/subject.component';
import { TopicComponent } from './topic/topic.component';
import { ContentComponent } from './content/content.component';
import { ContentDetailsComponent } from './content-details/content-details.component';

import { AboutusComponent } from './aboutus/aboutus.component';
import { PrivacypoliciesComponent } from './privacypolicies/privacypolicies.component';
import { ContactusComponent } from './contactus/contactus.component';

import { SettingComponent } from './setting/setting.component';
import { CommunicationComponent } from './communication/communication.component';
import { LiveclassComponent } from './liveclass/liveclass.component';
import { ChatComponent } from './chat/chat.component';
import { PollsComponent } from './polls/polls.component';
import { ForumComponent } from './forum/forum.component';
import { PollslistComponent } from './pollslist/pollslist.component';
import { LiveclasssinglepageComponent } from './liveclasssinglepage/liveclasssinglepage.component';
import { SupportrequestComponent } from './supportrequest/supportrequest.component';
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TaketestComponent } from './taketest/taketest.component';
import { TaketestresultComponent } from './taketestresult/taketestresult.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaymentGateWayComponent } from './payment-gate-way/payment-gate-way.component';
import { HelpandsupportComponent } from './helpandsupport/helpandsupport.component';
import { PracticeTestComponent } from './practice-test/practice-test.component';
import { ResultListComponent } from './result-list/result-list.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { TestListComponent } from './test-list/test-list.component';
import { ForumCategoryComponent } from './forum-category/forum-category.component';
import { ForumSubjectComponent } from './forum-subject/forum-subject.component';
import { ForumArticleComponent } from './forum-article/forum-article.component';
import { ForumTopicComponent } from './forum-topic/forum-topic.component';
import { NotificationComponent } from './notification/notification.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AddInstituteModule } from '../authenticationanderror/add-institute/add-institute.module';
import { NewsComponent } from './news/news.component';
import { SingleNewsComponent } from './single-news/single-news.component';
import { NewsCategoryListComponent } from './news-category-list/news-category-list.component';
import { BundleListComponent } from './testBundle/bundle-list/bundle-list.component';
import { SetListComponent } from './testBundle/set-list/set-list.component';
import { SeriesListComponent } from './testBundle/series-list/series-list.component';
import { QuestionListComponent } from './testBundle/question-list/question-list.component';
import { BundleTestResultComponent } from './testBundle/bundle-test-result/bundle-test-result.component';
import { BundleTestResultListComponent } from './testBundle/bundle-test-result-list/bundle-test-result-list.component';
import { BundleTestListComponent } from './testBundle/bundle-test-list/bundle-test-list.component';
import { TestListAllComponent } from './test-list-all/test-list-all.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    StudentComponent,
    DashboardComponent,
    SubjectComponent,
    TopicComponent,
    ContentComponent,
    ContentDetailsComponent,
    AboutusComponent,
    PrivacypoliciesComponent,
    ContactusComponent,
    SettingComponent,
    SidebarComponent,
    HeaderComponent,
    CommunicationComponent,
    LiveclassComponent,
    ChatComponent,
    PollsComponent,
    ForumComponent,
    PollslistComponent,
    LiveclasssinglepageComponent,
    SupportrequestComponent,
    TaketestComponent,
    TaketestresultComponent,
    PaymentGateWayComponent,
    HelpandsupportComponent,
    PracticeTestComponent,
    ResultListComponent,
    ReviewListComponent,
    TestListComponent,
    ForumCategoryComponent,
    ForumSubjectComponent,
    ForumArticleComponent,
    ForumTopicComponent,
    NotificationComponent,
    NewsComponent,
    SingleNewsComponent,
    NewsCategoryListComponent,
    BundleListComponent,
    SetListComponent,
    SeriesListComponent,
    QuestionListComponent,
    BundleTestResultComponent,
    BundleTestResultListComponent,
    BundleTestListComponent,
    TestListAllComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    StudentRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgxPayPalModule,
    NgxDocViewerModule,
    AddInstituteModule,
    PdfViewerModule,
    NgxStripeModule.forRoot()
  ]
})
export class StudentModule { }
