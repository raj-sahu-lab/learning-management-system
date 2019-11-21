import { Component, OnInit } from '@angular/core';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { TestApiHelper } from '../../../RestApiCall/ApiHelper/Test.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { NumberFormatStyle } from '@angular/common';
import * as XLSX from 'xlsx';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-test',
  providers: [SubjectApiHelper, PaymentgatewayApiHelper, TestApiHelper],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})

export class TestComponent implements OnInit {

  filter = false;

  selectedPreview: any;
  selectedDescription: any;
  selectedQuestion: any;

  currencyList = [];
  currencyId = undefined;

  testList = [];
  isEdit = false;
  testId = null;

  subjectList = [];
  subjectId: any;
  subjectIsPaid = false;

  topicsList: any[] = [];
  topicId: any;
  topicIsPaid = false;

  contentList: any[] = [];
  contentId: any;
  contentIsPaid = false;

  excelFile = null;
  arrayBuffer: any;

  title = '';
  description = '';

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  previewText = '';

  setQuestion = 0;
  setOfQuestions = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
  timedTest = '0';
  timeManage = '0';
  testDuration = 0;

  markDistribution = '0';
  totalMarks = 0;

  testQuestionList = [];

  status = '0';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columDescription = false;
  columPayment = false;
  columAmount = true;
  columPreview = false;
  columQuestion = true;
  columDuration = false;
  columMarks = true;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(protected serviceCurrency: CurrencyApiHelper,protected serviceSubject: SubjectApiHelper, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceTest: TestApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    this.currencyId = User.currency_id;

    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.servicePaymentGateWay.getPaymentGateWayList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        this.paymentGateWayList = res.data.gateWay;
        this.iOSInAppList = res.data.iOSInApp;
      }
    },
      (err) => {

        console.log(err);
      });

    this.serviceTest.getTestList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.testList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

    this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.currencyList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
      
  }

  dropDownFilter() {

    this.filter = !this.filter;
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

  deleteButtonClick(testId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete test?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceTest.deleteTest(testId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.testList.splice(this.testList.findIndex(obj => obj.id == testId), 1);
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

  cancelEditClick() {

    this.isEdit = false;
    this.testId = null;

    this.excelFile = null;
    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;
    this.title = '';
    this.description = '';

    this.status = '0';

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.previewText = '';
    this.status = '0';

    this.timedTest = '0';
    this.timeManage = '0';
    this.markDistribution = '0';
    this.totalMarks = 0;

  }

  markMessage(){
    alert();
  }

  selectExcelFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {

        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();

        for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
        {
          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];

          const fetchRow = XLSX.utils.sheet_to_json(worksheet, {raw: true});

          for (let row = 0; row < fetchRow.length; row++) {

            const questionSingle: any = fetchRow[row];

            const question = { type: 1, question: questionSingle.Question, answer1: questionSingle.Ans1, answer2: questionSingle.Ans2, answer3: questionSingle.Ans3, answer4: questionSingle.Ans4, rightanswer: questionSingle.RightAns, question_time: questionSingle.Time, question_mark: questionSingle.Marks, explanation: questionSingle.Explanation, videoLink: questionSingle.YoutubUrl };
            this.testQuestionList.push(question);
          }

        }
    };
    fileReader.readAsArrayBuffer(event.target.files[0]);

  }

  setAnswer(index, answerValue) {

    this.testQuestionList[index].rightanswer = answerValue;

  }

  submitButtonClick() {

    this.differentMark();
    this.differentTime();

    if (this.subjectId == null) {

      this.snotify.body = 'Please select course bundle.';
      this.snotify.onError();

    } else if (this.topicId == null) {

      this.snotify.body = 'Please select module.';
      this.snotify.onError();

    } else if (this.contentId == null) {

      this.snotify.body = 'Please select lecture content.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter instruction title.';
      this.snotify.onError();

    } else if (this.description == '') {

      this.snotify.body = 'Please enter instruction description.';
      this.snotify.onError();

    } else if (this.paymentGateWayId == undefined && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please select payment gateway.';
      this.snotify.onError();

    } else if (this.iosPaymentGateWayid == undefined && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please select iOS payment.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else if ((this.amount == null || this.amount == 0) && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please enter amount.';
      this.snotify.onError();

    } else if (this.previewText == '' && this.paymentTypeFree == '1') {

      this.snotify.body = 'Please enter preview.';
      this.snotify.onError();

    } else if (this.timedTest == '1' && this.timeManage == '1' && (this.testDuration == null || this.testDuration == 0)) {

      this.snotify.body = 'Please enter total duration.';
      this.snotify.onError();

    } else if (this.markDistribution == '1' && this.totalMarks == 0) {

      this.snotify.body = 'Please enter total mark.';
      this.snotify.onError();

    } else {

      let rightAnswer: any;

      this.testQuestionList.forEach(question => {

        if (question.rightanswer == '1') {

          rightAnswer  = question.answer1;

        } else if (question.rightanswer == '2') {

          rightAnswer  = question.answer2;

        } else if (question.rightanswer == '3') {

          rightAnswer  = question.answer3;

        } else if (question.rightanswer == '4') {

          rightAnswer  = question.answer4;

        }

        question['rightanswer'] = rightAnswer;

      });

      const testData: { [k: string]: any } = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        contentId: this.contentId,
        title: this.title,
        description: this.description,

        timedTest: this.timedTest,
        testDuration: this.testDuration,
        totalMarks: this.totalMarks,

        isPaid: this.paymentTypeFree,
        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : null,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : null,
        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null,
        questions: this.testQuestionList
      };
      
      this.serviceTest.addTest(testData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();
      
        if (res.success && res.data != null) {

          this.testList.unshift(res.data);
          this.helperService.loadDataTable();
          this.testQuestionList = [];
          this.cancelEditClick();
        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
        });

    }
  }

  setQuestionAdd() {
    if (this.setQuestion == 0) {

      this.testQuestionList = [];

    } else {

      for (let i = 1; i <= this.setQuestion; i++) {

        const question = { type: 1, question: '', answer1: '', answer2: '', answer3: '', answer4: '', rightanswer: '', question_time: 0, question_mark: '', explanation: '', videoLink: '' };
        this.testQuestionList.push(question);
      }

    }
  }

  addButtonClick() {

    const question = { type: 1, question: '', answer1: '', answer2: '', answer3: '', answer4: '', rightanswer: '', question_time: 0, question_mark: '', explanation: '', videoLink: '' };
    this.testQuestionList.push(question);

    if (this.markDistribution == '1') {

      this.equalMark();

    }

    if (this.timeManage == '1') {

      this.equalTime();

    }

  }

  removeButtonClick(index) {

    this.testQuestionList.splice(index, 1);

    if (this.markDistribution == '1') {

      this.equalMark();

    }

    if (this.timeManage == '1') {

      this.equalTime();

    }

  }

  equalMark() {

    this.testQuestionList.forEach(question => {

      question.question_mark = (this.totalMarks / (this.testQuestionList.length));

    });

  }

  differentMark() {
    let totalMark = 0;
    this.testQuestionList.forEach(question => {

      totalMark += question.question_mark;

    });
    this.totalMarks = totalMark;

  }

  equalTime() {

    this.testQuestionList.forEach(question => {

      question.question_time = (this.testDuration / (this.testQuestionList.length));
    });

  }

  differentTime() {
    let totalTime = 0;
    this.testQuestionList.forEach(question => {

      totalTime += question.question_time;

    });
    this.testDuration = totalTime;

  }

  showPreview(testId) {

    this.selectedPreview = this.testList.find(obj => obj.id == testId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(testId) {

    this.selectedDescription = this.testList.find(obj => obj.id == testId);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

  showQuestion(testId) {

    this.selectedQuestion = this.testList.find(obj => obj.id == testId);
  }

  hideQuestion() {

    this.selectedQuestion = null;
  }

}
