import { Component, OnInit } from '@angular/core';
import { TermApiHelper } from '../../../RestApiCall/ApiHelper/term.service';
import { PlandetailApiHelper } from '../../../RestApiCall/ApiHelper/plandetail.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-plandetail',
  providers: [TermApiHelper, PlandetailApiHelper],
  templateUrl: './plandetail.component.html',
  styleUrls: ['./plandetail.component.scss']
})

export class PlandetailComponent implements OnInit {

  plandetailList = [];
  isEdit = false;
  plandetailId = null;

  termandplanList = [];
  planList = [];
  termandplanId: any;
  planId: any;

  title = '';

  constructor(protected serviceTerm: TermApiHelper, protected servicePlandetail: PlandetailApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.serviceTerm.getTermsAndPlanList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.termandplanList = res.data;

      }
    },
      (err) => {

        console.log(err);
      });


      this.servicePlandetail.getPlandetailList().subscribe((res: ServerResponse) => {

        if (res.success && res.data != null) {

          this.plandetailList = res.data;
          this.helperService.loadDataTable();
        }
      },
        (err) => {

          console.log(err);
        });
  }

  deleteButtonClick(plandetailId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete plan detail?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePlandetail.deletePlandetail(plandetailId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.plandetailList.splice(this.plandetailList.findIndex(obj => obj.id == plandetailId), 1);
          this.helperService.loadDataTable();
          this.cancelEditClick();

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log("NO");
    });
  }

  editButtonClick(plandetailId) {

    const plandetail = this.plandetailList.find(obj => obj.id == plandetailId);
    this.isEdit = true;
    this.plandetailId = plandetailId;

    this.termandplanId = plandetail.term.id;
    this.termChanged();

    this.planId = plandetail.plan.id;
    this.title = plandetail.title;

    document.getElementById('startForm').scrollIntoView();

  }

  cancelEditClick() {

    this.isEdit = false;
    this.plandetailId = null;

    this.termandplanId = undefined;
    this.planId = undefined;
    this.title = '';
    
  }

  submitButtonClick() {

    if (this.termandplanId == null) {

      this.snotify.body = 'Please select plan duration.';
      this.snotify.onError();

    } else if (this.planId == null) {

      this.snotify.body = 'Please select plan.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter plan features.';
      this.snotify.onError();

    } else {

      const plandetailData: { [k: string]: any } = {

        term_id: this.termandplanId,
        plan_id: this.planId,
        title: this.title,
      };

      if (this.isEdit) {

        plandetailData.planDetailId = this.plandetailId;

        this.servicePlandetail.updatePlandetail(plandetailData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.plandetailList[this.plandetailList.findIndex(obj => obj.id === this.plandetailId)] = res.data;
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

        this.servicePlandetail.addPlandetail(plandetailData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.plandetailList.unshift(res.data);
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

  termChanged() {

    this.termandplanList.forEach(termandplan => {

        if (this.termandplanId === termandplan.id) {

          this.planList = termandplan.plan;
        }
    });

    this.planId = undefined;
  }

}
