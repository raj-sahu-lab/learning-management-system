import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { BundleService } from '../../../RestApiCall/ApiHelper/bundle.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  title: any;
  selectedQuestions: any = [];
  questionList: any = [];
  page = 1;
  limit = 10;
  seriesPage = 1;
  seriesLists: any = [];
  
  editSeries: any;
  delQuesMdl: any;

  questionType = [];
  description = '';

  timedTest = '0';
  timeManage = '0';
  testDuration = 0;

  marked = '0';
  markDistribution = '0';
  totalMarks = 0;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(public snotify: TostNotificationService, public bundleService: BundleService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;

    this.getSeriesList(this.seriesPage, this.limit);
  }

  getSeriesList(seriesPage, limit) {

    this.seriesPage = seriesPage;
    this.bundleService.getBundleSeries(seriesPage, limit).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        if (this.seriesLists) {
          res.data.forEach(qstn => {
            this.seriesLists.push(qstn);
          });
        } else { this.seriesLists = res.data; }
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  typeSelected(event, index) {
    this.page = 1;
    this.seriesPage = 1;

    if (event.target.checked) {
      this.questionType.push(index + 1);
    }

    if (!event.target.checked) {
        this.questionType.splice(index, 1);
    }

    const data = {
      types: this.questionType
    };

    this.bundleService.getQuestionByTypes(this.page, this.limit, data).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.selectedQuestions = [];
        this.questionList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  getQuestionList(page, limit, type) {
    const data = {
      types: type
    };

    this.page = page;
    this.bundleService.getQuestionByTypes(page, limit, data).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        if (this.questionList) {
          res.data.forEach(qstn => {
            this.questionList.push(qstn);
          });
        } else { this.questionList = res.data; }
      }
    },
      (err) => {

        console.log(err);
      });
  }

  questionChecked(id, event) {

    if (event.target.checked) {

      this.selectedQuestions.push(id);
    }

    if (!event.target.checked) {

      const index = this.selectedQuestions.indexOf(id);

      if (index > -1) {

        this.selectedQuestions.splice(index, 1);
      }
    }

  }

  editQuestionChecked(id, event) {

    if (event.target.checked) {

      this.selectedQuestions.push(id);
    }

    if (!event.target.checked) {

      const index = this.selectedQuestions.indexOf(id);

      if (index > -1) {

        this.selectedQuestions.splice(index, 1);
      }
    }

  }

  allChecked(questions, event) {

    this.selectedQuestions = [];

    questions.forEach(question => {

      const qstn = document.getElementById('question' + question.id) as HTMLInputElement;

      if (event.target.checked) {

        qstn.checked = true;
        this.selectedQuestions.push(question.id);
      } else {

        this.selectedQuestions = [];
        qstn.checked = false;
      }

    });

  }

  submitButtonClick() {
    if (!this.questionType.length) {
      this.snotify.body = 'Please Select Question type';
      this.snotify.onError();
    } else if (!this.title) {
      this.snotify.body = 'Please Enter title';
      this.snotify.onError();
    } else if (this.description == '') {

      this.snotify.body = 'Please enter instruction description.';
      this.snotify.onError();

    } else if (this.timedTest == '1' && this.timeManage == '1' && (this.testDuration == null || this.testDuration == 0)) {

      this.snotify.body = 'Please enter total duration.';
      this.snotify.onError();

    } else if (this.marked == '1' && this.markDistribution == '1' && this.totalMarks == 0) {

      this.snotify.body = 'Please enter total mark.';
      this.snotify.onError();

    } else if (this.selectedQuestions.length <= 0) {
      this.snotify.body = 'Please Select questions';
      this.snotify.onError();
    } else {
      const data = {
        title : this.title,
        selectedQuestions : this.selectedQuestions,
        preview : this.description,
        timed : this.timedTest,
        timeEqual : this.timeManage,
        duration : this.testDuration,
        marked : this.marked,
        markEqual : this.markDistribution,
        totalMarks : this.totalMarks
      };

      this.bundleService.createQuestionBundleSeries(data).subscribe((res: ServerResponse) => {

        if (res != null && res.success && res.data != null) {
          this.seriesLists.unshift(res.data);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      },
        (err) => {
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }
  }

  cancelEditClick() {
    this.selectedQuestions = [];
    this.title = undefined;
    this.questionType = [];
    this.questionList = [];
    this.page = 1;
    this.description = '';

    this.timedTest = '0';
    this.timeManage = '0';
    this.testDuration = 0;

    this.marked = '0';
    this.markDistribution = '0';
    this.totalMarks = 0;
    $('input[type=checkbox]').prop('checked', false);
  }

  updateButtonClick() {
    if (this.selectedQuestions.length <= 0) {
      this.snotify.body = 'Please Select questions';
      this.snotify.onError();
    } else {
      const data = {
        seriesId : this.editSeries.id,
        selectedQuestions : this.selectedQuestions
      };
      this.bundleService.addQuestionBundleSeries(data).subscribe((res: ServerResponse) => {

        if (res != null && res.success && res.data) {
          const index = this.seriesLists.findIndex(obj => obj.id == this.editSeries.id);
          if (index >= 0) {
            this.seriesLists[index] = res.data;
            this.helperService.loadDataTable();
          }
          this.hideEditModal();
        }
      },
        (err) => {
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }
  }

  deleteSeriesButtonClick(id) {
    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this Series?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {
      this.bundleService.deleteBundleSeries(id).subscribe((res: ServerResponse) => {
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res != null && res.success) {
          this.seriesLists.splice(this.seriesLists.findIndex(obj => obj.id == id), 1);
          this.helperService.loadDataTable();
        }
      },
        (err) => {
          console.log(err);
        });
    }, (no) => {
      console.log('NO');
    });
  }

  deleteQuestionClick(id) {
    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this question?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {
      this.bundleService.removeQuestionBundleSeries(id).subscribe((res: ServerResponse) => {
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.delQuesMdl.questionList.splice(this.delQuesMdl.questionList.findIndex(obj => obj.id == id), 1);
        }
      },
        (err) => {
          console.log(err);
        });
    }, (no) => {
      console.log('NO');
    });
  }

  editButtonClick(seriesList) {
    this.editSeries = seriesList;
    this.selectedQuestions = [];
    this.title = undefined;
    this.questionType = [];
    $('input[type=checkbox]').prop('checked', false);
    this.questionList = [];
    this.page = 1;
  }
  deleteSerQstButtonClick(seriesList) {
    this.delQuesMdl = seriesList;
  }
  hideEditModal() {
    this.editSeries = null;
    this.selectedQuestions = [];
    this.title = undefined;
    this.questionType = [];
    $('input[type=checkbox]').prop('checked', false);
    this.questionList = [];
    this.page = 1;
  }
  hideDeleteModal() {
    this.delQuesMdl = null;
  }

}
