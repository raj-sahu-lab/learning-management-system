import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { PollslistComponent } from './pollslist/pollslist.component';
import { LiveclasssinglepageComponent } from './liveclasssinglepage/liveclasssinglepage.component';
import { SupportrequestComponent } from './supportrequest/supportrequest.component';
import { TaketestComponent } from './taketest/taketest.component';
import { HelpandsupportComponent } from './helpandsupport/helpandsupport.component';
import { ForumComponent } from './forum/forum.component';
import { PracticeTestComponent } from './practice-test/practice-test.component';
import { TaketestresultComponent } from './taketestresult/taketestresult.component';
import { ResultListComponent } from './result-list/result-list.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestListAllComponent } from './test-list-all/test-list-all.component';
import { ForumCategoryComponent } from './forum-category/forum-category.component';
import { ForumSubjectComponent } from './forum-subject/forum-subject.component';
import { ForumArticleComponent } from './forum-article/forum-article.component';
import { ForumTopicComponent } from './forum-topic/forum-topic.component';
import { NotificationComponent } from './notification/notification.component';
import { AddInstituteComponent } from '../authenticationanderror/add-institute/addInstitute.component';
import { NewsComponent } from './news/news.component';
import { NewsCategoryListComponent } from './news-category-list/news-category-list.component';
import { BundleListComponent } from './testBundle/bundle-list/bundle-list.component';
import { BundleTestListComponent } from './testBundle/bundle-test-list/bundle-test-list.component';
import { SetListComponent } from './testBundle/set-list/set-list.component';
import { SeriesListComponent } from './testBundle/series-list/series-list.component';
import { QuestionListComponent } from './testBundle/question-list/question-list.component';
import { BundleTestResultComponent } from './testBundle/bundle-test-result/bundle-test-result.component';

const routes: Routes = [
  {
    path: '' , component: StudentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'addInstitute/:id', component: AddInstituteComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'subject', component: SubjectComponent },
      { path: 'topic', component: TopicComponent },
      { path: 'content', component: ContentComponent },
      { path: 'content-details', component: ContentDetailsComponent },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'privacypolicies', component: PrivacypoliciesComponent },
      { path: 'contactus', component: ContactusComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'communication', component: CommunicationComponent },
      { path: 'liveclass', component: LiveclassComponent },
      { path: 'liveclassPage', component: LiveclasssinglepageComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'pollslist', component: PollslistComponent },
      { path: 'polls', component: PollsComponent },
      { path: 'supportrequest', component: SupportrequestComponent},
      { path: 'taketest', component: TaketestComponent},
      { path: 'faq', component: HelpandsupportComponent},
      { path: 'forum', component: ForumComponent},
      { path: 'forum/category', component: ForumCategoryComponent},
      { path: 'forum/subject', component: ForumSubjectComponent},
      { path: 'forum/article', component: ForumArticleComponent},
      { path: 'forum/topic', component: ForumTopicComponent},
      { path: 'test', component: TestListComponent},
      { path: 'alltest', component: TestListAllComponent},
      { path: 'practice', component: PracticeTestComponent},
      { path: 'resultList', component: ResultListComponent},
      { path: 'result', component: TaketestresultComponent},
      { path: 'reviews', component: ReviewListComponent},
      { path: 'notifications', component: NotificationComponent},
      { path: 'news' , component:NewsComponent },
      { path: 'news/category' , component:NewsCategoryListComponent },
      { path: 'testBundleList', component:BundleTestListComponent },
      { path: 'testBundle', component:BundleListComponent },
      { path: 'bundleSet', component:SetListComponent },
      { path: 'bundleSeries', component:SeriesListComponent },
      { path: 'bundleQuestion', component:QuestionListComponent },
      { path: 'bundleResult', component:BundleTestResultComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
