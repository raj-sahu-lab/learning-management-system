import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { NumberFormatStyle } from '@angular/common';

import { TermApiHelper } from '../../../RestApiCall/ApiHelper/term.service';
import { PlanApiHelper } from '../../../RestApiCall/ApiHelper/plan.service';
declare var $: any;
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-plan',
  providers: [TermApiHelper],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  planList = [];
  isEdit = false;
  planId = null;

  termandplanList = [];
  termandplanId = undefined;

  menuList = [];

  title = '';
  amount = 0;
  amountUSD = 0;
  emailSubject = '';
  emailContent = '';

  menuPermission:any = [];

  searchBox = '';

  constructor(protected serviceTerm: TermApiHelper,protected servicePlan: PlanApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

   this.termsPlan();
   this.listOfPlan();
   this.listOfMenu();

  }

  termsPlan() {

    this.serviceTerm.getTermsAndPlanList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.termandplanList = res.data;

      }
    },
      (err) => {

        console.log(err);
      });
  }

  listOfPlan() {

    this.servicePlan.getPlanList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.planList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  listOfMenu() {

    this.servicePlan.getMenuList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.menuList = res.data;

      }
    },
      (err) => {

        console.log(err);
      });
  }

  mainmenuChange(menuId:number,isChecked: boolean) {

      if (isChecked) {

        this.menuPermission.push({selectedMenuId:menuId});

      } else {

        for (let index = 0; index < this.menuPermission.length; index++) {

          const element = this.menuPermission[index];

          if(element.selectedMenuId == menuId) {
            this.menuPermission.splice(index, 1);
          }

        }

      }

  }

  menuCheck(menuId:number,subMenuId:number,isChecked: boolean) {

    let isMenuAvailable = false;
    let menuAvailableIndex = undefined;

    for (let index = 0; index < this.menuPermission.length; index++) {

      const element = this.menuPermission[index];

      if(element.selectedMenuId == menuId) {

        isMenuAvailable = true;
        menuAvailableIndex = index;
        break;

      }

    }

    if(isMenuAvailable) {

      let selectedSubMenuId = [];
      if(this.menuPermission[menuAvailableIndex].selectedSubMenuId){
        selectedSubMenuId = this.menuPermission[menuAvailableIndex].selectedSubMenuId.split(',') ;
      }

      let indexOfOld = selectedSubMenuId.indexOf(subMenuId+"");

      if(indexOfOld != -1){
        selectedSubMenuId.splice(indexOfOld, 1);

        const menu = document.getElementById('menu' + menuId) as HTMLInputElement;
        menu.checked = false;

      } else {

        selectedSubMenuId.push(subMenuId+"");
      }

      this.menuPermission[menuAvailableIndex].selectedSubMenuId = selectedSubMenuId.join(',');


    } else {

      this.menuPermission.push({selectedMenuId:menuId,selectedSubMenuId:subMenuId+''});

      const menu = document.getElementById('menu' + menuId) as HTMLInputElement;
      menu.checked = true;

    }

  }

  deleteButtonClick(planId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete plan?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.servicePlan.deletePlan(planId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.planList.splice(this.planList.findIndex(obj => obj.id == planId), 1);
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

  editButtonClick(planId) {

    const plan = this.planList.find(obj => obj.id == planId);
    this.isEdit = true;
    this.planId = planId;
    this.termandplanId = plan.term.id;

    this.title = plan.title;
    this.amount = plan.amount;
    this.amountUSD = plan.amountUSD;
    this.emailSubject = plan.subject_title;
    this.emailContent = plan.mail_content;

    document.getElementById('startForm').scrollIntoView();

  }

  cancelEditClick() {

    this.isEdit = false;
    this.planId = null;

    this.termandplanId = undefined;
    this.title = '';
    this.amount = 0;
    this.amountUSD = 0;
    this.emailSubject = '';
    this.emailContent = '';
  }

  submitButtonClick() {

    if (this.termandplanId == undefined) {

      this.snotify.body = 'Please select plan duration.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter plan title.';
      this.snotify.onError();

    } else if (this.amount == null || this.amount == 0) {

      this.snotify.body = 'Please enter plan ₹ amount.';
      this.snotify.onError();

    } else if (this.amountUSD == null || this.amountUSD == 0) {

      this.snotify.body = 'Please enter plan $ amount.';
      this.snotify.onError();

    } else if (this.emailSubject == '') {

      this.snotify.body = 'Please enter email subject.';
      this.snotify.onError();

    } else if (this.emailContent == '') {

      this.snotify.body = 'Please enter email content.';
      this.snotify.onError();

    } else {

      let planData: { [k: string]: any } = {

        term_id: this.termandplanId,
        title: this.title,
        amount: this.amount,
        amountUSD: this.amountUSD,
        emailSubject: this.emailSubject,
        emailContent: this.emailContent,
        menuPermission: this.menuPermission,

      };

      if (this.isEdit) {

        planData.planId = this.planId;

        this.servicePlan.updatePlan(planData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.planList[this.planList.findIndex(obj => obj.id == this.planId)] = res.data;
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

        this.servicePlan.addPlan(planData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {

            this.planList.unshift(res.data);
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

}
