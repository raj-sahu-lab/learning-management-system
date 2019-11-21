import { Component, OnInit } from '@angular/core';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { BundleService } from '../../../RestApiCall/ApiHelper/bundle.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

declare var $: any;
declare var katex: any;
import { NgxImageCompressService} from 'ngx-image-compress';

enum ButtonType {
  OPERATIONAL = 'OPERATIONAL',
  REGULAR = 'REGULAR'
}

@Component({
  selector: 'app-question',
  providers: [ SubjectApiHelper],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  filter = false;

  selectedDescription: any;

  isEdit = false;
  questionId = null;

  subjectList = [];
  subjectId: any;

  status = '0';
  question = '';
  description = '';
  questionOptons: any;
  fx = 'f\\left(x\\right)';

  questionMediaFile: any;
  questionMediaImage: any;
  previewAnswer: any;

  imageWidth: number;
  imageHeight: number;
  imageSize: number;

  MQ = null;
  typeEquation;

  dataText = '';
  contentPreview: any;

  basicButtons = [
    this.buildRegularButton('/', 'cmd'),
    this.buildRegularButton('*', 'cmd'),
    this.buildRegularButton('-', 'cmd'),

    this.buildRegularButton('.', 'cmd'),
    this.buildRegularButton('=', 'cmd'),
    this.buildRegularButton('+', 'cmd'),

    // this.buildRegularButton('a','cmd'),
    // this.buildRegularButton('b','cmd'),
    // this.buildRegularButton('c','cmd'),

    // this.buildRegularButton('x','cmd'),
    // this.buildRegularButton('y','cmd'),
    // this.buildRegularButton('z','cmd'),

    // this.buildRegularButton('\\ln','cmd'),
    // this.buildRegularButton('\\lg','cmd'),
    // this.buildRegularButton('\\log','cmd'),
    // this.buildRegularButton('\\dim','cmd'),
    // this.buildRegularButton('\\min','cmd'),
    // this.buildRegularButton('\\det','cmd'),
    // this.buildRegularButton('\\max','cmd'),
    // this.buildRegularButton('\\gcd','cmd'),
    // this.buildRegularButton('\\lim','cmd'),


    this.buildRegularButton('a^2', 'write'),
    this.buildRegularButton('a^x', 'write'),
    this.buildRegularButton('a_x', 'write'),
    this.buildRegularButton('\\left|x\\right|', 'write'),
    this.buildRegularButton('\\lceil x\\rceil', 'write'),
    this.buildRegularButton('\\lfloor x\\rfloor', 'write'),
    this.buildRegularButton('\\frac{\\text{d}x}{\\text{d}y}', 'write'),
    this.buildRegularButton('\\frac{\\partial x}{\\partial y}', 'write'),
    this.buildRegularButton('\\int_x^y', 'write'),
    this.buildRegularButton('\\oint_x^y', 'write'),
    this.buildRegularButton('\\log_xy', 'write'),
    this.buildRegularButton('\\lim_{x\\rightarrow y}', 'write'),
    this.buildRegularButton('\\sum_x^y', 'write'),
    this.buildRegularButton('\\prod_x^y', 'write'),
    this.buildRegularButton('\\overleftarrow{xy}', 'write'),
    this.buildRegularButton('\\overline{xy}', 'write'),
    this.buildRegularButton('\\overrightarrow{xy}', 'write'),

    this.buildRegularButton('times', 'cmd', '\\times{n}'),
    // this.buildRegularButton('sin','cmd','\\sin'),
    // this.buildRegularButton('cos','cmd','\\cos'),
    // this.buildRegularButton('sec','cmd','\\sec'),
    // this.buildRegularButton('div','cmd','\\div'),
    this.buildRegularButton('pi', 'cmd', '\\pi'),
    this.buildRegularButton('angle', 'cmd', '\\angle'),

    this.buildRegularButton('\\ne', 'write'),
    this.buildRegularButton('\\sim', 'write'),
    this.buildRegularButton('\\approx', 'write'),
    this.buildRegularButton('\\cong', 'write'),

    this.buildRegularButton('{}:{}', 'write', 'a:b'),
    this.buildRegularButton(':', 'write', ':'),
    this.buildRegularButton('\\%', 'write', '\\%'),
    this.buildRegularButton('^\\circ', 'write', '^\\circ'),
    this.buildRegularButton('\\bigtriangleup', 'write', '\\bigtriangleup'),

    this.buildRegularButton('<-', 'write', '<-'),
    this.buildRegularButton('->', 'write', '->'),
    this.buildRegularButton('<<', 'write', '<<'),

    this.buildRegularButton('(', 'cmd', '()'),
    this.buildRegularButton('\{', 'cmd', '\\{'),
    this.buildRegularButton('[', 'cmd', '[]'),

    this.buildRegularButton('\\pm', 'write', '\\pm'),
    this.buildRegularButton('sqrt', 'cmd', '\\sqrt{x}'),
    this.buildRegularButton('\\frac{}{}', 'write', '\\frac{a}{b}'),
    this.buildRegularButton('\\frac{}{}', 'write', 'x\\frac{a}{b}'),

    this.buildRegularButton('\\sqrt[3]{}', 'write', '\\sqrt[3]{x}'),
    this.buildRegularButton('\\sqrt[n]{}', 'write', '\\sqrt[n]{x}'),
    this.buildRegularButton('\\int_a^b', 'write', '\\int_a^b'),
    this.buildRegularButton('\\%', 'write', '\\%'),


    this.buildRegularButton('\\lim_{a\\to \\infty}', 'write', '\\lim_{a\\to \\infty}'),

    this.buildRegularButton('1', 'cmd'),
    this.buildRegularButton('2', 'cmd'),
    this.buildRegularButton('3', 'cmd'),

    this.buildRegularButton('4', 'cmd'),
    this.buildRegularButton('5', 'cmd'),
    this.buildRegularButton('6', 'cmd'),

    this.buildRegularButton('7', 'cmd'),
    this.buildRegularButton('8', 'cmd'),
    this.buildRegularButton('9', 'cmd'),
    this.buildRegularButton('0', 'cmd'),

    // this.buildOperationalButton('Backspace', 'backspace'),

  ];

  greekButtons = [
    this.buildRegularButton('\\alpha', 'cmd'),
    this.buildRegularButton('\\beta', 'cmd'),
    this.buildRegularButton('\\gamma', 'cmd'),
    this.buildRegularButton('\\delta', 'cmd'),
    this.buildRegularButton('\\zeta', 'cmd'),
    this.buildRegularButton('\\eta', 'cmd'),
    this.buildRegularButton('\\theta', 'cmd'),
    this.buildRegularButton('\\iota', 'cmd'),
    this.buildRegularButton('\\kappa', 'cmd'),
    this.buildRegularButton('\\mu', 'cmd'),
    this.buildRegularButton('\\nu', 'cmd'),
    this.buildRegularButton('\\xi', 'cmd'),
    this.buildRegularButton('\\rho', 'cmd'),
    this.buildRegularButton('\\sigma', 'cmd'),
    this.buildRegularButton('\\tau', 'cmd'),
    this.buildRegularButton('\\chi', 'cmd'),
    this.buildRegularButton('\\psi', 'cmd'),
    this.buildRegularButton('\\phi', 'cmd'),
    this.buildRegularButton('\\varphi', 'cmd'),
    this.buildRegularButton('\\epsilon', 'cmd'),
    this.buildRegularButton('\\varepsilon', 'cmd'),
    this.buildRegularButton('\\varpi', 'cmd'),
    this.buildRegularButton('\\varsigma', 'cmd'),
    this.buildRegularButton('\\vartheta', 'cmd'),
    this.buildRegularButton('\\upsilon', 'cmd'),
    this.buildRegularButton('\\digamma', 'cmd'),
    this.buildRegularButton('\\varkappa', 'cmd'),
    this.buildRegularButton('\\varrho', 'cmd'),
    this.buildRegularButton('\\pi', 'cmd'),
    this.buildRegularButton('\\lambda', 'cmd'),
    this.buildRegularButton('\\Upsilon', 'cmd'),
    this.buildRegularButton('\\Gamma', 'cmd'),
    this.buildRegularButton('\\Delta', 'cmd'),
    this.buildRegularButton('\\Theta', 'cmd'),
    this.buildRegularButton('\\Lambda', 'cmd'),
    this.buildRegularButton('\\Xi', 'cmd'),
    this.buildRegularButton('\\Pi', 'cmd'),
    this.buildRegularButton('\\Sigma', 'cmd'),
    this.buildRegularButton('\\Phi', 'cmd'),
    this.buildRegularButton('\\Psi', 'cmd'),
    this.buildRegularButton('\\Omega', 'cmd'),
  ];

  advanceButtons = [
    this.buildRegularButton('\\models', 'cmd'),
    this.buildRegularButton('\\prec', 'cmd'),
    this.buildRegularButton('\\succ', 'cmd'),
    this.buildRegularButton('\\preceq', 'cmd'),
    this.buildRegularButton('\\succeq', 'cmd'),
    this.buildRegularButton('\\simeq', 'cmd'),
    this.buildRegularButton('\\mid', 'cmd'),
    this.buildRegularButton('\\ll', 'cmd'),
    this.buildRegularButton('\\gg', 'cmd'),
    this.buildRegularButton('\\parallel', 'cmd'),
    this.buildRegularButton('\\bowtie', 'cmd'),
    this.buildRegularButton('\\sqsubset', 'cmd'),
    this.buildRegularButton('\\sqsupset', 'cmd'),
    this.buildRegularButton('\\smile', 'cmd'),
    this.buildRegularButton('\\sqsubseteq', 'cmd'),
    this.buildRegularButton('\\sqsupseteq', 'cmd'),
    this.buildRegularButton('\\doteq', 'cmd'),
    this.buildRegularButton('\\frown', 'cmd'),
    this.buildRegularButton('\\vdash', 'cmd'),
    this.buildRegularButton('\\dashv', 'cmd'),
    this.buildRegularButton('\\longleftarrow', 'cmd'),
    this.buildRegularButton('\\longrightarrow', 'cmd'),
    this.buildRegularButton('\\Longleftarrow', 'cmd'),
    this.buildRegularButton('\\Longrightarrow', 'cmd'),
    this.buildRegularButton('\\longleftrightarrow', 'cmd'),
    this.buildRegularButton('\\updownarrow', 'cmd'),
    this.buildRegularButton('\\Longleftrightarrow', 'cmd'),
    this.buildRegularButton('\\Updownarrow', 'cmd'),
    this.buildRegularButton('\\mapsto', 'cmd'),
    this.buildRegularButton('\\nearrow', 'cmd'),
    this.buildRegularButton('\\hookleftarrow', 'cmd'),
    this.buildRegularButton('\\hookrightarrow', 'cmd'),
    this.buildRegularButton('\\searrow', 'cmd'),
    this.buildRegularButton('\\leftharpoonup', 'cmd'),
    this.buildRegularButton('\\rightharpoonup', 'cmd'),
    this.buildRegularButton('\\swarrow', 'cmd'),
    this.buildRegularButton('\\leftharpoondown', 'cmd'),
    this.buildRegularButton('\\rightharpoondown', 'cmd'),
    this.buildRegularButton('\\nwarrow', 'cmd'),
    this.buildRegularButton('\\oint', 'cmd'),
    this.buildRegularButton('\\bigcap', 'cmd'),
    this.buildRegularButton('\\bigcup', 'cmd'),
    this.buildRegularButton('\\bigsqcup', 'cmd'),
    this.buildRegularButton('\\bigvee', 'cmd'),
    this.buildRegularButton('\\bigwedge', 'cmd'),
    this.buildRegularButton('\\bigodot', 'cmd'),
    this.buildRegularButton('\\bigotimes', 'cmd'),
    this.buildRegularButton('\\bigoplus', 'cmd'),
    this.buildRegularButton('\\biguplus', 'cmd')
  ];
  quilltest: any;

  answerList = [];

  insertId: any;
  questionType = '1';
  mark: any;
  duration: any;
  questionLists: any;
  previewImage: any;

  page = 1;
  limit = 10;

  columSubject = false;
  columType = false;
  columImage = true;
  columQuestion = true;
  columMark = true;
  columDuration = true;
  columStatus = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(protected serviceSubject: SubjectApiHelper,  public snotify: TostNotificationService, public bundleService: BundleService, private imageCompress: NgxImageCompressService, public helperService: HelperService) { }

  ngOnInit() {

    this.editorButton(0);
    const question = { id: 1, answer: '', isAnswer: 0, isSelected : false, file: '', image: ''};
    this.answerList.push(question);

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;

    // Get Subject List
    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    // Get Question List
    this.getQuestion(this.page, this.limit);

  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

  getQuestion(page, limit) {
    this.page = page;
    this.bundleService.getQuestionBundle(page, limit).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        if (this.questionLists) {
          res.data.forEach(qstn => {
            this.questionLists.push(qstn);
          });
        } else { this.questionLists = res.data; }
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  ngAfterViewInit() {
    this.MQ = (window as any).MathQuill.getInterface(2);
  }

  editorButton(i) {
    $(document).ready(function() {
      $('.Bold').click(function() {
        $('.Bold').toggleClass('f1f1');
        document.execCommand('bold');
      });
       $('.Italic').click(function() {
        $('.Italic').toggleClass('f1f1');
        document.execCommand('italic');
      });
      $('.underLine').click(function() {
        $('.underLine').toggleClass('f1f1');
        document.execCommand('underLine');
      });
      $('.strike').click(function() {
        $('.strike').toggleClass('f1f1');
        document.execCommand('strikeThrough');
      });

      // first answer
      if (i == 0) {
      $('.Bold-0').click(function() {
        $('.Bold-0').toggleClass('f1f1');
        document.execCommand('bold', false, null);
      });
       $('.Italic-0').click(function() {
        $('.Italic-0').toggleClass('f1f1');
        document.execCommand('italic', false, null);
      });
      $('.underLine-0').click(function() {
        $('.underLine-0').toggleClass('f1f1');
        document.execCommand('underLine', false, null);
      });
      $('.strike-0').click(function() {
        $('.strike-0').toggleClass('f1f1');
        document.execCommand('strikeThrough', false, null);
      });
     }
      // second answer
      if (i == 1) {
      $('.Bold-2').click(function() {
        $('.Bold-2').toggleClass('f1f1');
        document.execCommand('bold', false, null);
      });
       $('.Italic-2').click(function() {
        $('.Italic-2').toggleClass('f1f1');
        document.execCommand('italic', false, null);
      });
      $('.underLine-2').click(function() {
        $('.underLine-2').toggleClass('f1f1');
        document.execCommand('underLine', false, null);
      });
      $('.strike-2').click(function() {
        $('.strike-2').toggleClass('f1f1');
        document.execCommand('strikeThrough', false, null);
      });
    }
      // third answer
      if (i == 2) {
      $('.Bold-4').click(function() {
        $('.Bold-4').toggleClass('f1f1');
        document.execCommand('bold', false, null);
      });
       $('.Italic-4').click(function() {
        $('.Italic-4').toggleClass('f1f1');
        document.execCommand('italic', false, null);
      });
      $('.underLine-4').click(function() {
        $('.underLine-4').toggleClass('f1f1');
        document.execCommand('underLine', false, null);
      });
      $('.strike-4').click(function() {
        $('.strike-4').toggleClass('f1f1');
        document.execCommand('strikeThrough', false, null);
      });
    }
      // fourth answer
      if (i == 3) {
      $('.Bold-6').click(function() {

        $('.Bold-6').toggleClass('f1f1');
        document.execCommand('bold', false, null);
      });
       $('.Italic-6').click(function() {
        $('.Italic-6').toggleClass('f1f1');
        document.execCommand('italic', false, null);
      });
      $('.underLine-6').click(function() {
        $('.underLine-6').toggleClass('f1f1');
        document.execCommand('underLine', false, null);
      });
      $('.strike-6').click(function() {
        $('.strike-6').toggleClass('f1f1');
        document.execCommand('strikeThrough', false, null);
      });
    }
      // fifth answer
      if (i == 4) {
      $('.Bold-8').click(function() {
        $('.Bold-8').toggleClass('f1f1');
        document.execCommand('bold', false, null);
      });
       $('.Italic-8').click(function() {
        $('.Italic-8').toggleClass('f1f1');
        document.execCommand('italic', false, null);
      });
      $('.underLine-8').click(function() {
        $('.underLine-8').toggleClass('f1f1');
        document.execCommand('underLine', false, null);
      });
      $('.strike-8').click(function() {
        $('.strike-8').toggleClass('f1f1');
        document.execCommand('strikeThrough', false, null);
      });
      }

    });
  }

  clearFormat() {
    $('.Bold').removeClass('f1f1');
    $('.Italic').removeClass('f1f1');
    $('.underLine').removeClass('f1f1');
    $('.strike').removeClass('f1f1');

    $('.Bold-0').removeClass('f1f1');
    $('.Italic-0').removeClass('f1f1');
    $('.underLine-0').removeClass('f1f1');
    $('.strike-0').removeClass('f1f1');

    $('.Bold-2').removeClass('f1f1');
    $('.Italic-2').removeClass('f1f1');
    $('.underLine-2').removeClass('f1f1');
    $('.strike-2').removeClass('f1f1');

    $('.Bold-4').removeClass('f1f1');
    $('.Italic-4').removeClass('f1f1');
    $('.underLine-4').removeClass('f1f1');
    $('.strike-4').removeClass('f1f1');

    $('.Bold-6').removeClass('f1f1');
    $('.Italic-6').removeClass('f1f1');
    $('.underLine-6').removeClass('f1f1');
    $('.strike-6').removeClass('f1f1');

    $('.Bold-8').removeClass('f1f1');
    $('.Italic-8').removeClass('f1f1');
    $('.underLine-8').removeClass('f1f1');
    $('.strike-8').removeClass('f1f1');

  }

  addAnswerClick() {
    if (this.answerList.length < 5) {
      const question = { id: this.answerList.length + 1, answer: '', isAnswer: 0, isSelected : false, file: '', image: ''};
      this.answerList.push(question);
      this.editorButton(this.answerList.length - 1);
    }
  }

  removeAnswer(index) {
    this.answerList.splice(index, 1);
  }

  removeQuestionImage() {
    this.questionMediaImage = '';
  }

  showDescription(index) {

    if (window.innerWidth >= 768) {
      if (index !== 'typeYourQuestion') {
        if (this.answerList[index - 1].file !== '') {
          if (confirm('either image or text can be added,Image added will be removed')) {
            this.selectedDescription = 'Show';
          }
        } else {
          this.selectedDescription = 'Show';
        }
      } else {
        this.selectedDescription = 'Show';
      }
    } else {
      this.snotify.body = 'Login with Desktop to use advance math equation';
      this.snotify.onError();
    }


  }

  hideDescription() {

    this.selectedDescription = null;
  }

  hidePreviewAnswer() {
    this.previewAnswer = null;
  }

  onClickMathButton(e: any, button) {

    this.typeEquation = document.getElementById('typeEquation');
    const latexSpan = document.getElementById('equationString');
    // this.MQ = (window as any).MathQuill.getInterface(2);
    const mathField = this.MQ.MathField(this.typeEquation, {

      handlers: {
        edit: function () { // useful event handlers
          latexSpan.textContent = mathField.latex(); // simple API
        }
      }
    });

    if (button.action == 'write') {

      this.MQ.MathField(this.typeEquation).write(button.content);

    } else if (button.action == 'cmd') {

      this.MQ.MathField(this.typeEquation).cmd(button.content);

    } else {

      this.MQ.MathField(this.typeEquation).keystroke(button.content);
    }

    this.MQ.MathField(this.typeEquation).focus();
    e.preventDefault();
  }

  mathSperatetext(id) {
    this.insertId = id;

    this.typeEquation = document.getElementById('typeEquation');
    const latexSpan = document.getElementById('equationString');

    const mathField = this.MQ.MathField(this.typeEquation, {
      handlers: {
        edit: function () { // useful event handlers
          latexSpan.textContent = mathField.latex(); // simple API
        }
      }
    });
  }

  idToInsert(id) {
    this.insertId = id;
  }

  insert() {

    if (this.insertId !== 'typeYourQuestion') {
      this.answerList[this.insertId - 1].file = '';
      this.answerList[this.insertId - 1].image = '';
    }

    const latexSpan = document.getElementById('typeEquation');
    const mathArea = document.getElementById(this.insertId);

    mathArea.innerHTML += '<span class="mq-editable-field mq-math-mode border-0 d-inline-block" contenteditable="false">' + latexSpan.innerHTML + '</span>';

    this.MQ.MathField(this.typeEquation).latex('');

    $('.mathquill-editable').find('textarea').focus();
    const clickTextArea: HTMLElement = document.getElementById(this.insertId) as HTMLElement;
    clickTextArea.click();
    this.hideDescription();

  }

  clearSelected() {

    this.answerList.forEach(ans => {
      ans.isAnswer = 0;
      ans.isSelected = false;
    });
  }


  private buildRegularButton(content: string, action ?: string, displayContent ?: string) {
    return {
      displayContent: displayContent ? displayContent : content,
      content: content,
      type: ButtonType.REGULAR,
      action: action
    };
  }

  questionFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);
        this.questionMediaImage = e.target['result'];

        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;

      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  compressImage(image, fileName) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);
        // imageFile created below is the new compressed file which can be send to API in form data
        this.questionMediaFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
        this.imageSize = Math.round(this.questionMediaFile.size / 1024);
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  answerFileChanged(fileInput: any, id) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const img = new Image();
      img.src = window.URL.createObjectURL(fileInput.target.files[0]);

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressAnswerImage(e.target.result, fileName, id);

        this.answerList[id].image = e.target['result'];

        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;

      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  compressAnswerImage(image, fileName, id) {
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);
        // imageFile created below is the new compressed file which can be send to API in form data
        this.answerList[id].file = new File([imageBlob], imageName, { type: 'image/jpeg' });
        this.imageSize = Math.round(this.answerList[id].file.size / 1024);
    });
  }

  setAnswer(answer) {

    if ((this.questionType == '1') || (this.questionType == '3')) {

      this.answerList.forEach(ans => {
        if (ans.id == answer.id) {
          if (answer.isSelected) {
            ans.isAnswer = 1;
          } else {
            ans.isAnswer = 0;
            ans.isSelected = false;
          }
        } else {
          ans.isAnswer = 0;
          ans.isSelected = false;
        }
      });
    } else if (this.questionType == '2') {

      this.answerList.forEach(ans => {

        if (ans.id == answer.id) {
          if (answer.isSelected) {
            ans.isAnswer = 1;
          } else { ans.isAnswer = 0; }
        }
      });

    }

  }

  openFileUpload(id) {
    const clickTextArea: HTMLElement = document.getElementById(id) as HTMLElement;
    clickTextArea.click();
  }

  openFileUploadForAnswer(id) {
    if (confirm('either image or text can be added,text added will be removed')) {
      document.getElementById(id).innerHTML = '';
      this.answerList[id - 1].answer = '';
      const clickTextArea: HTMLElement = document.getElementById('input-' + id) as HTMLElement;
      clickTextArea.click();
    }
  }

  submitButtonClick() {

    if (!this.subjectId) {
      this.snotify.body = 'Please Select course bundle';
      this.snotify.onError();
    } else if (!this.questionType) {
      this.snotify.body = 'Please Select Type';
      this.snotify.onError();
    } else if (!this.mark) {
      this.snotify.body = 'Please Enter Mark';
      this.snotify.onError();
    } else if (!this.duration) {
      this.snotify.body = 'Please Enter Duration';
      this.snotify.onError();
    } else {
      const options: any = [];
      let answerSelected = 0;

      this.answerList.forEach((option , index) => {
        option.answer = document.getElementById(option.id).innerHTML;
        options[index] = {id: option.id, answer: option.file !== '' ? '' : option.answer, isAnswer: option.isAnswer};
        if (option.isAnswer) {
          answerSelected++;
        }
      });

      if (answerSelected > 0) {
        const data: { [k: string]: any } = {
          subjectId : this.subjectId,
          question : document.getElementById('typeYourQuestion').innerHTML,
          questionType : this.questionType,
          questionOptions : JSON.stringify(options),
          mark : this.mark,
          duration : this.duration
        };

        const images = {
          questionMedia : '',
          answerMedia1 : '',
          answerMedia2 : '',
          answerMedia3 : '',
          answerMedia4 : '',
          answerMedia5 : '',
        };
        if (this.questionMediaFile) {
          images.questionMedia = this.questionMediaFile;
        }
        if (this.answerList[0]) {
          if (this.answerList[0].file !== '') {
            images.answerMedia1 = this.answerList[0].file;
          }
        }
        if (this.answerList[1]) {
          if (this.answerList[1].file !== '') {
            images.answerMedia2 = this.answerList[1].file;
          }
        }
        if (this.answerList[2]) {
          if (this.answerList[2].file !== '') {
            images.answerMedia3 = this.answerList[2].file;
          }
        }
        if (this.answerList[3]) {
          if (this.answerList[3].file !== '') {
            images.answerMedia4 = this.answerList[3].file;
          }
        }
        if (this.answerList[4]) {
          if (this.answerList[4].file !== '') {
            images.answerMedia5 = this.answerList[4].file;
          }
        }
        if (data.question == '' && images.questionMedia == '') {
          this.snotify.body = 'Please Enter question';
          this.snotify.onError();
        } else {
          this.bundleService.addQuestionBundle(data, images).subscribe((res: ServerResponse) => {
            this.snotify.body = res.message;
            this.snotify.onSuccess();
            if (res != null && res.success && res.data != null) {
              // this.clearFormat();
              // this.editorButton(0);
              this.clearFields();
              if (this.questionLists.length) {
                this.questionLists.unshift(res.data);
              } else { this.questionLists[0] = res.data; }
              location.reload();
            }
          },
            (err) => {
              this.snotify.body = err.error;
              this.snotify.onError();
            });
        }
      } else {
        this.snotify.body = 'Please select the correct answer';
        this.snotify.onError();
      }


    }
  }

  clearFields() {
    const question = { id: 1, answer: '', isAnswer: 0, isSelected : false, file: '', image: ''};
    this.answerList = [];
    this.answerList.push(question);

    this.questionMediaFile = '';
    this.questionMediaImage = '';
    const questionText = document.getElementById('typeYourQuestion');
    questionText.innerHTML = '';
    this.subjectId = undefined;
    this.mark = undefined;
    this.questionType = '1';
    this.duration = '';
  }

  deleteButtonClick(id) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this question?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {
      this.bundleService.deleteQuestionBundle(id).subscribe((res: ServerResponse) => {
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res != null && res.success) {
          this.questionLists.splice(this.questionLists.findIndex(obj => obj.id == id), 1);
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

  answerPreview(answer) {
    this.previewAnswer = answer;
  }

  imagePreview(img) {
    this.previewImage = img;
  }
  hidePreviewImage() {
    this.previewImage = null;
  }

}
