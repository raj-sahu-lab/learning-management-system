import { Component, OnInit } from '@angular/core';
import { SetApiHelper } from '../../../RestApiCall/ApiHelper/Set.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { BundleService } from '../../../RestApiCall/ApiHelper/bundle.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-set',
  providers: [SetApiHelper],
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss']
})
export class SetComponent implements OnInit {

  setList: any = [];
  seriesLists: any = [];
  editSet: any;

  title = '';
  page = 1;
  seriesPage = 1;
  limit = 10;
  selectedSeries: any = [];
  setSelected: any;

  loggedIn : any;
  public userType: number;
  public userPurchaseTearm: number;
  public userPurchasePlan: number;

  constructor(protected serviceSet: SetApiHelper, public snotify: TostNotificationService, public bundleService: BundleService, public helperService: HelperService) { }

  ngOnInit() {
    
    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    this.userPurchaseTearm = User.plan.term_id;
    this.userPurchasePlan = User.plan.plan_id;
    
    this.getSeries(this.seriesPage, this.limit);
    this.getSet(this.page, this.limit);

  }

  getSet(page, limit) {
    this.page = page;
    this.serviceSet.getSetList(page, limit).subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        if (this.setList) {
          res.data.forEach(set => {
            this.setList.push(set);
          });
        } else {
          this.setList = res.data;
        }
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  getSeries(page, limit) {

    this.seriesPage = page;
    this.bundleService.getBundleSeries(page, limit).subscribe((res: ServerResponse) => {
      if (res != null && res.success && res.data != null) {
        if (this.seriesLists) {
          res.data.forEach(series => {
            this.seriesLists.push(series);
          });
        } else {
          this.seriesLists = res.data;
        }
      }
    },
      (err) => {
        console.log(err);
      });
  }

  selectAll(event) {

    this.selectedSeries = [];

    this.seriesLists.forEach(series => {

      const srs = document.getElementById('series' + series.id) as HTMLInputElement;

      if (event.target.checked) {
        srs.checked = true;
        this.selectedSeries.push(series.id);
      } else {
        this.selectedSeries = [];
        srs.checked = false;
      }

    });

  }

  seriesChecked(id, event) {
    if (event.target.checked) {
      this.selectedSeries.push(id);
    }

    if (!event.target.checked) {
      const index = this.selectedSeries.indexOf(id);
      if (index > -1) {
        this.selectedSeries.splice(index, 1);
      }
    }

  }

  editSeriesChecked(id, event) {
    if (event.target.checked) {
      this.selectedSeries.push(id);
    }

    if (!event.target.checked) {
      const index = this.selectedSeries.indexOf(id);
      if (index > -1) {
        this.selectedSeries.splice(index, 1);
      }
    }

  }

  hideEditModal() {
    this.selectedSeries = [];
    this.seriesLists.forEach(series => {
      const srs = document.getElementById('editSeries' + series.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.editSet = null;
  }

  deleteSetButtonClick(id: any) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete set?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSet.deleteSet(id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.setList.splice(this.setList.findIndex(obj => obj.id == id), 1);
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

  showSeriesList(set) {
    this.setSelected = set;
  }

  deleteSeriesButtonClick(id: any) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete this series from set?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSet.removeSeriesFromSet(id).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.setSelected.seriesList.splice(this.setSelected.seriesList.findIndex(obj => obj.id == id), 1);
        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });
  }
  
  hideDeleteModal() {
    this.setSelected = null;
  }

  editButtonClick(setList) {
    this.editSet = setList;
    this.selectedSeries = [];
    this.seriesLists.forEach(series => {
      const srs = document.getElementById('series' + series.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.title = undefined;
    this.page = 1;
    this.seriesPage = 1;
  }

  cancelEditClick() {

    this.title = '';
    this.selectedSeries = [];
    const selAll = document.getElementById('selectAll') as HTMLInputElement;
    if (selAll) {
      selAll.checked = false;
    }
    this.seriesLists.forEach(series => {
      const srs = document.getElementById('series' + series.id) as HTMLInputElement;
      if (srs) {
        srs.checked = false;
      }
    });
    this.page = 1;
    this.seriesPage = 1;
  }

  submitButtonClick() {

    if (this.title == '') {
      this.snotify.body = 'Please Enter Title.';
      this.snotify.onError();
    } else if (!this.selectedSeries.length) {
      this.snotify.body = 'Please Select Series';
      this.snotify.onError();
    } else {

      const setData: {[k: string]: any} = {
        title: this.title,
        selectedSeries: this.selectedSeries
      };

      this.serviceSet.addSet(setData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.data != null) {
          this.setList.unshift(res.data);
          this.helperService.loadDataTable();
          this.seriesLists.forEach(series => {
            const srs = document.getElementById('series' + series.id) as HTMLInputElement;
            srs.checked = false;
          });
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

  updateSubmitButtonClick() {
    if (this.selectedSeries.length <= 0) {
      this.snotify.body = 'Please Select Series';
      this.snotify.onError();
    } else {
      const data = {
        setId : this.editSet.id,
        selectedSeries : this.selectedSeries
      };
      this.serviceSet.addSeriesToSet(data).subscribe((res: ServerResponse) => {

        if (res != null && res.success && res.data) {
          const index = this.setList.findIndex(obj => obj.id == this.editSet.id);
          if (index >= 0) {
            this.setList[index] = res.data;
          }
          this.helperService.loadDataTable();
          this.hideEditModal();
        }
      },
        (err) => {
          this.snotify.body = err.error;
          this.snotify.onError();
        });
    }
  }
}
