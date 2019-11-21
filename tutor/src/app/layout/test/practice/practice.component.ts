import { Component, OnInit } from '@angular/core';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { PracticeApiHelper } from '../../../RestApiCall/ApiHelper/Practice.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';


@Component({
  selector: 'app-practice',
  providers: [SubjectApiHelper, PracticeApiHelper],
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})

export class PracticeComponent implements OnInit {

  filter = false;

  selectedDescription: any;

  practiceList = [];
  isEdit = false;
  practiceId = null;
  editIndex = null;

  subjectList = [];
  subjectId: any;
  subjectIsPaid = false;

  topicsList: any[] = [];
  topicId: any;
  topicIsPaid = false;

  contentList: any[] = [];
  contentId: any;
  contentIsPaid = false;

  title = '';

  practiceQuestionList = [];

  status = '0';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columQuestion = true;
  columStatus = true;

  constructor(protected serviceSubject: SubjectApiHelper, protected servicePractice: PracticeApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.servicePractice.getPracticeList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.practiceList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

    this.addButtonClick(); // for default 1 question
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete practice?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePractice.deletePractice(this.practiceList[index].id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.practiceList.splice(index, 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }

  editButtonClick(index) {

    const practice = this.practiceList[index];

    this.isEdit = true;
    this.practiceId = practice.id;
    this.editIndex = index;

    this.subjectId = practice.subject.id;
    this.subjectChanged();

    this.topicId = practice.topic.id;
    this.topicChanged();

    this.contentId = practice.content.id;
    this.contentChange();

    this.status = practice.status ? practice.status.toString() : '0';

  }

  cancelEditClick() {

    this.isEdit = false;
    this.practiceId = null;
    this.editIndex = null;

    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;

    this.title = '';
    this.status = '0';

  }

  submitButtonClick() {

    if (this.subjectId == null ) {

      this.snotify.body = 'Please select course bundle.';
      this.snotify.onError();

    } else if (this.topicId == null ) {

      this.snotify.body = 'Please select module.';
      this.snotify.onError();

    }  else if (this.contentId == null ) {

      this.snotify.body = 'Please select lecture content.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter practice name.';
      this.snotify.onError();

    } else {

      const practiceData: {[k: string]: any} = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        contentId: this.contentId,
        title: this.title,
        questions: this.practiceQuestionList
      };

      if (this.isEdit) {

        practiceData.setId = this.practiceId;
        practiceData.status = this.status;

        this.servicePractice.updatePractice(practiceData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.practiceList[this.editIndex] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.servicePractice.addPractice(practiceData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.practiceList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();
            this.practiceQuestionList = [];
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);
          });
      }
    }
  }

  subjectChanged() {

    this.subjectList.forEach(subject => {

        if (this.subjectId == subject.id) {
          this.subjectIsPaid = subject.isPaid;
          this.topicsList = subject.topics;
        }
    });

    this.topicChanged();
    this.topicId = undefined;

    this.contentList = [];
    this.contentId = undefined;
    this.topicIsPaid = false;
    this.contentIsPaid = false;
  }

  topicChanged() {

    this.topicsList.forEach(topic => {

      if (this.topicId == topic.id) {

        this.topicIsPaid = topic.isPaid;
        this.contentList = topic.contents;
      }
    });

    this.contentChange();
    this.contentId = undefined;
    this.contentIsPaid = false;
  }

  contentChange() {

    this.contentList.forEach(content => {

      if (this.contentId == content.id) {

        this.contentIsPaid = content.isPaid;
      }
    });

  }

  addButtonClick() {

    const question = {question: '' , rightanswer: ''};
    this.practiceQuestionList.push(question);
  }

  removeButtonClick(index) {
    this.practiceQuestionList.splice(index, 1);
  }

  showDescription(index) {

    this.selectedDescription = this.practiceList[index];
  }

  hideDescription() {

    this.selectedDescription = null;
  }

}
