import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchApiHelper } from '../../../RestApiCall/ApiHelper/Branch.service';
import { zoomCredentialApiHelper } from '../../../RestApiCall/ApiHelper/ZoomCredential.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-zoom-credential',
  templateUrl: './zoom-credential.component.html',
  styleUrls: ['./zoom-credential.component.scss']
})
export class ZoomCredentialComponent implements OnInit {

  zoomCredentialList = [];
  isEdit = false;
  zoomCredentialId = null;
  editIndex = null;

  branchList = [];
  branchId = undefined;
  
  apiKey = '';
  apiSecret = '';

  androidApiKey = '';
  androidApiSecret = '';

  loggedIn : any;
  public userType: number;

  constructor(public router: Router,protected serviceZoomCredential: zoomCredentialApiHelper, protected serviceBranch: BranchApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    const User = JSON.parse(localStorage.getItem('User'));
    this.userType = User.userType;
    if(this.userType != 1) {

      this.router.navigate(['/not-found']);
    }
    
    this.serviceBranch.getBranchList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {

        this.branchList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });

    this.getZoomList();

  }

  getZoomList() {

    this.serviceZoomCredential.getZoomCredentialList().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.zoomCredentialList = res.data;

      }
    },
    (err) => {

      console.log(err);
    });
  }

  editButtonClick(zoomCredentialId) {

    const zoomCredential = this.zoomCredentialList.find(obj => obj.id == zoomCredentialId);
    this.isEdit = true;
    this.zoomCredentialId = zoomCredentialId;
    this.branchId = zoomCredential.branchId;
    this.apiKey = zoomCredential.key;
    this.apiSecret = zoomCredential.secret;
    this.androidApiKey = zoomCredential.androidkey;
    this.androidApiSecret = zoomCredential.androidSecret;
  }

  cancelEditClick() {

    this.isEdit = false;
    this.zoomCredentialId = null;

    this.branchId = undefined;
    this.apiKey = '';
    this.apiSecret = '';

    this.androidApiKey = '';
    this.androidApiSecret = '';
  }

  deleteButtonClick(zoomCredentialId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete zoom credential?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceZoomCredential.deleteZoomCredential(zoomCredentialId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.zoomCredentialList.splice(this.zoomCredentialList.findIndex(obj => obj.id == zoomCredentialId), 1);
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

    if (this.branchId == undefined) {

      this.snotify.body = 'Please select branch.';
      this.snotify.onError();

    } else if (this.apiKey == '') {

      this.snotify.body = 'Please enter api key.';
      this.snotify.onError();

    } else if (this.apiSecret == '') {

      this.snotify.body = 'Please enter secret key.';
      this.snotify.onError();

    } else if (this.androidApiKey == '') {

      this.snotify.body = 'Please enter android api key.';
      this.snotify.onError();

    } else if (this.androidApiSecret == '') {

      this.snotify.body = 'Please enter android secret key.';
      this.snotify.onError();

    } else {
      
      let zoomCredentialData:{[k: string]: any} = {
        
        branchId: this.branchId,
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        androidApiKey: this.androidApiKey,
        androidApiSecret: this.androidApiSecret
      };
      console.log(zoomCredentialData);

      if (this.isEdit) {

        zoomCredentialData.id = this.zoomCredentialId;
        
        this.serviceZoomCredential.updateZoomCredential(zoomCredentialData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();
          
          this.helperService.loadDataTable();
          this.cancelEditClick();
          this.getZoomList();
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);
      
          });
      } else {

        this.serviceZoomCredential.addZoomCredential(zoomCredentialData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {
            
            this.zoomCredentialList.unshift(res.data);
            this.helperService.loadDataTable();
            this.cancelEditClick();
            this.getZoomList();
          
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
