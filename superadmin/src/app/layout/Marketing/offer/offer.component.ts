import { Component, OnInit } from '@angular/core';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TermApiHelper } from '../../../RestApiCall/ApiHelper/term.service';
import { OfferApiHelper } from '../../../RestApiCall/ApiHelper/offer.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  filter = false;

  offerList = [];
  isEdit = false;
  offerId: any;

  termList = [];
  termId: any;

  offerType = undefined;
  title = '';
  code = '';
  noOfUsers = '';
  discount = '';
  maxDiscountAmount = '';
  maxDollerAmount = '';
  sDate:any;
  eDate:any;

  status = '0'

  columTerm = true;
  columSubject = true;
  columTitle = true;
  columCode = true;
  columUsers = true;
  columDiscount = true;
  columMaxDollerAmount = true;
  columMaxAmount = true;
  columStartDate = false;
  columEndDate = false;
  columStatus = true;

  constructor(protected serviceTerm: TermApiHelper, protected serviceOffer: OfferApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.sDate = new Date().toISOString().slice(0, 10);
    this.eDate = new Date().toISOString().slice(0, 10);

    this.serviceTerm.getTermList().subscribe((res: ServerResponse) => {

      if (res.success != null && res.success && res.data != null) {

        this.termList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.serviceOffer.getOfferList().subscribe((res: ServerResponse) => {

      if (res.success != null && res.success && res.data != null) {

        this.offerList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  cancelEditClick() {

    this.isEdit = false;
    this.offerId = null;
    this.termId = undefined;

    this.offerType = undefined;
    this.title = '';
    this.code = '';
    this.noOfUsers = '';
    this.discount = '';
    this.maxDiscountAmount = '';
    this.maxDollerAmount = '';
    this.sDate = '';
    this.eDate = '';

    this.status = '0';
  }

  editButtonClick(offerId) {

    const offer = this.offerList.find(obj => obj.id == offerId);

    this.isEdit = true;
    this.offerId = offerId;
    this.termId = offer.term.id;
    this.title = offer.title;
    this.code = offer.code;
    this.noOfUsers = offer.users;
    this.discount = offer.discount;
    this.maxDiscountAmount = offer.maxAmount;
    this.maxDollerAmount = offer.maxDollerAmount;
    this.sDate = offer.startDate;
    this.eDate = offer.endDate;
    this.status = offer.status ? offer.status.toString() : '0';

    document.getElementById('startForm').scrollIntoView();
  }

  submitButtonClick() {

    if (this.termId == undefined) {

      this.snotify.body = 'Please select plan duration.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter offer title.';
      this.snotify.onError();

    } else if (this.code == '') {

      this.snotify.body = 'Please enter offer code.';
      this.snotify.onError();

    } else if (this.noOfUsers == '') {

      this.snotify.body = 'Please enter no of Users.';
      this.snotify.onError();

    } else if (this.discount == '') {

      this.snotify.body = 'Please enter discount.';
      this.snotify.onError();

    } else if (this.maxDiscountAmount == '') {

      this.snotify.body = 'Please enter max discount amount.';
      this.snotify.onError();

    } else if (this.maxDollerAmount == '') {

      this.snotify.body = 'Please enter max $ discount amount.';
      this.snotify.onError();

    } else if (this.sDate == '') {

      this.snotify.body = 'Please select start date.';
      this.snotify.onError();

    } else if (this.eDate == '') {

      this.snotify.body = 'Please select end date.';
      this.snotify.onError();

    } else {

      const offer: { [k: string]: any } = {

        type: this.offerType,
        termId: this.termId,
        title: this.title,
        code: this.code,
        noOfUsers: this.noOfUsers,
        discount: this.discount,
        maxAmount: this.maxDiscountAmount,
        maxDollerAmount: this.maxDollerAmount,
        startDate: this.sDate,
        endtDate: this.eDate,
      };

      if (this.isEdit) {

        offer.offerId = this.offerId;
        offer.status = this.status;

        this.serviceOffer.updateOffer(offer).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.offerList[this.offerList.findIndex(obj => obj.id === this.offerId)] = res.data;
            this.helperService.loadDataTable();
            this.cancelEditClick();
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

          });
      } else {

        this.serviceOffer.addOffer(offer).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.offerList.unshift(res.data);
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
  }

  deleteButtonClick(offerId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete offer?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceOffer.deleteOffer(offerId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.offerList.splice(this.offerList.findIndex(obj => obj.id === offerId), 1);
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
}
