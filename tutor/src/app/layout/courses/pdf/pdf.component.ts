import { Component, OnInit } from '@angular/core';
import { PaymentgatewayApiHelper } from '../../../RestApiCall/ApiHelper/Paymentgateway.service';
import { SubjectApiHelper } from '../../../RestApiCall/ApiHelper/Subject.service';
import { PdfApiHelper } from '../../../RestApiCall/ApiHelper/Pdf.service';
import { SpaceApiHelper } from '../../../RestApiCall/ApiHelper/Space.service';
import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';
import { AuthApiHelper } from '../../../RestApiCall/ApiHelper/AuthApiHelper.service';
declare var $: any;

@Component({
  selector: 'app-pdf',
  providers: [PaymentgatewayApiHelper, SubjectApiHelper, PdfApiHelper],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})

export class PdfComponent implements OnInit {

  filter = false;

  usedSpace = 0;

  selectedPreview: any;
  selectedDescription: any;

  currencyList = [];
  currencyId = undefined;

  pdfList = [];
  isEdit = false;
  pdfId = null;

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

  pdf = '';
  selectedPdf: any;
  selectedPdfFile: any;

  downloadable = '0';

  paymentTypeFree = '0';

  paymentGateWayId = undefined;
  iosPaymentGateWayid = undefined;
  paymentGateWayList = [];
  iOSInAppList = [];

  amount = 0;
  validity = 0;
  previewText = '';

  status = '0';

  PDFUrl: SafeResourceUrl = '';

  columBranch = false;
  columTutor = false;
  columSubject = true;
  columTopic = true;
  columContent = true;
  columTitle = true;
  columPDF = true;
  columPayment = false;
  columAmount = true;
  columValidity = true;
  columPreview = false;
  columStatus = true;
  columDownloadable = true;

  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(private authApiHelper: AuthApiHelper, protected serviceCurrency: CurrencyApiHelper, private sanitizer: DomSanitizer, protected servicePaymentGateWay: PaymentgatewayApiHelper, protected serviceSpace: SpaceApiHelper, protected serviceSubject: SubjectApiHelper, protected servicePdf: PdfApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    try {
      const User = JSON.parse(localStorage.getItem('User'));
      this.userType = User.userType;
      this.userPurchaseTearm = User.plan.term_id;
      this.userPurchasePlan = User.plan.plan_id;
      this.currencyId = User.currency_id;

      this.currencyGet();
      this.usedSpaceGet();
      this.paymentGateWayListGet();
      this.subjectAndTopicListGet();
      this.pdfListGet();

    } catch (error) {
      this.authApiHelper.tryCatchFail();
      console.log(error);
    }

  }

  currencyGet() {
    this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.currencyList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  usedSpaceGet() {
    this.serviceSpace.getUsedSpace().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.usedSpace = res.data.usedSpace;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  paymentGateWayListGet() {
    this.servicePaymentGateWay.getPaymentGateWayList().subscribe((res: ServerResponse) => {
      if (res != null && res.success && res.data != null) {

        this.paymentGateWayList = res.data.gateWay;
        this.iOSInAppList = res.data.iOSInApp;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  subjectAndTopicListGet() {
    this.serviceSubject.getSubjectAndTopicList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.subjectList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  pdfListGet() {
    this.servicePdf.getPdfList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        this.pdfList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }
  FileChangedPdf(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedPdfFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedPdf = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  editButtonClick(pdfId) {

    document.getElementById('startForm').scrollIntoView();
    const pdf = this.pdfList.find(obj => obj.id == pdfId);

    this.isEdit = true;
    this.pdfId = pdfId;

    this.subjectId = pdf.subject.id;
    this.subjectChanged();

    this.topicId = pdf.topic.id;
    this.topicChanged();

    this.contentId = pdf.content.id;
    this.contentChange();

    this.selectedPdf = pdf.pdf;
    this.title = pdf.title;

    this.downloadable = pdf.downloadable ? pdf.downloadable.toString() : '0';
    this.status = pdf.status ? pdf.status.toString() : '0';
    this.paymentTypeFree = pdf.isPaid ? pdf.isPaid.toString() : '0';

    this.paymentGateWayId = pdf.paymentgateway_id ? pdf.paymentgateway_id : undefined;
    this.iosPaymentGateWayid = pdf.iosPaymentGateWay.id ? pdf.iosPaymentGateWay.id : undefined;

    this.currencyId = pdf.currency?.id;
    this.amount = pdf.amount;
    this.validity = pdf.validity;
    this.previewText = pdf.preview;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.pdfId = null;

    this.subjectId = undefined;
    this.topicId = undefined;
    this.contentId = undefined;

    this.title = '';

    this.pdf = '';
    this.selectedPdf = null;

    this.downloadable = '0';

    this.paymentTypeFree = '0';
    this.paymentGateWayId = undefined;
    this.iosPaymentGateWayid = undefined;
    this.currencyId = this.currencyId;
    this.amount = 0;
    this.validity = null;
    this.previewText = '';
    this.status = '0';

  }

  deleteButtonClick(pdfId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete pdf?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePdf.deletePdf(pdfId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.pdfList.splice(this.pdfList.findIndex(obj => obj.id == pdfId), 1);
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

  submitButtonClick() {

    if (this.userPurchasePlan == 7 && this.usedSpace > 2) {

      this.snotify.body = 'You can not upload more than 2 GB video in a free trial.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 1 || this.userPurchasePlan == 6) && this.usedSpace > 25) {

      this.snotify.body = 'You can not upload more than 25 GB video in a basic plan.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 2 || this.userPurchasePlan == 4) && this.usedSpace > 500) {

      this.snotify.body = 'You can not upload more than 500 GB video in a premium plan.';
      this.snotify.onError();

    } else if ((this.userPurchasePlan == 3 || this.userPurchasePlan == 5) && this.usedSpace > 1024) {

      this.snotify.body = 'You can not upload more than 1024 GB video in a ultimate plan.';
      this.snotify.onError();

    } else if (this.subjectId == null) {

      this.snotify.body = 'Please select course bundle.';
      this.snotify.onError();

    } else if (this.topicId == null) {

      this.snotify.body = 'Please select module.';
      this.snotify.onError();

    } else if (this.contentId == null) {

      this.snotify.body = 'Please select lecture content.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter PDF name.';
      this.snotify.onError();

    } else if (this.selectedPdfFile == null && this.pdfId == null) {

      this.snotify.body = 'Please select file.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.paymentGateWayId == undefined) {

      this.snotify.body = 'Please select payment gateway.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.iosPaymentGateWayid == undefined) {

      this.snotify.body = 'Please select iOS payment gateway.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && (this.amount == null || this.amount == 0)) {

      this.snotify.body = 'Please enter amount.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && (this.validity == null || this.validity == 0)) {

      this.snotify.body = 'Please enter validity.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.validity >= 365) {

      this.snotify.body = 'Please enter validity less than 365 days.';
      this.snotify.onError();

    } else if (this.paymentTypeFree == '1' && this.previewText == '') {

      this.snotify.body = 'Please enter preview.';
      this.snotify.onError();

    } else {

      const pdfData: { [k: string]: any } = {

        subjectId: this.subjectId,
        topicId: this.topicId,
        contentId: this.contentId,

        downloadable: this.downloadable,
        isPaid: this.paymentTypeFree,

        paymentGateWayId: this.paymentTypeFree == '1' ? this.paymentGateWayId : null,
        iosPaymentGateWayid: this.paymentTypeFree == '1' ? this.iosPaymentGateWayid : null,

        currencyId: this.paymentTypeFree == '1' ? this.currencyId : null,
        amount: this.paymentTypeFree == '1' ? this.amount : null,
        validity: this.paymentTypeFree == '1' ? this.validity : null,
        reviewText: this.paymentTypeFree == '1' ? this.previewText : null,
        title: this.title,
      };

      if (this.isEdit) {

        pdfData.pdfId = this.pdfId;
        pdfData.status = this.status;

        this.servicePdf.updatePdf(this.selectedPdfFile, pdfData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.pdfList[this.pdfList.findIndex(obj => obj.id == this.pdfId)] = res.data;
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

        this.servicePdf.addPdf(this.selectedPdfFile, pdfData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.pdfList.unshift(res.data);
            this.helperService.loadDataTable();
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
  }

  subjectChanged() {

    this.subjectList.forEach(subject => {

      if (this.subjectId == subject.id) {
        this.subjectIsPaid = subject.isPaid;
        this.topicsList = subject.topics;

        this.paymentTypeFree = '0';
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

        this.paymentTypeFree = '0';
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

        this.paymentTypeFree = '0';
      }
    });

  }

  showPreview(pdfId) {

    this.selectedPreview = this.pdfList.find(obj => obj.id == pdfId);
  }

  hidePreview() {

    this.selectedPreview = null;
  }

  showDescription(pdfId) {

    this.selectedDescription = this.pdfList.find(obj => obj.id == pdfId);
    this.PDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDescription.url);
  }

  hideDescription() {

    this.selectedDescription = null;
  }

  dropDownFilter() {

    this.filter = !this.filter;
  }

}
