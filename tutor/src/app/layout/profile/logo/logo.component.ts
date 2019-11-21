import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingApiHelper } from '../../../RestApiCall/ApiHelper/Setting.service';
import { LogoApiHelper } from '../../../RestApiCall/ApiHelper/Logo.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  logo = '';
  selectedLogoFile: any;

  settingList = [];
  logotId = null;

  public picture: string;

  constructor(public router: Router, protected serviceLogo: LogoApiHelper, protected servicesetting: SettingApiHelper, public snotify: TostNotificationService, private imageCompress: NgxImageCompressService) { }

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('User'));
    this.picture = user.account_image;
    if (user.userType !== 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }
  }

  submitButtonClick() {

    if (this.picture == null) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

    } else {

      this.serviceLogo.updateLogo(this.selectedLogoFile).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success && res.success && res.data != null) {

          localStorage.setItem('User', JSON.stringify(res.data));
          this.logo = '';
          location.reload();
        }
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

        });

    }
  }

  logoFileChanged(fileInput: any) {
    let  fileName: any;
    if (fileInput.target.files && fileInput.target.files[0]) {

      const reader = new FileReader();
      fileName = fileInput.target.files[0]['name'];

      reader.onload = ((e: any) => {
        this.compressImage(e.target.result, fileName);
        this.picture = e.target['result'];
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
        this.selectedLogoFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
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

}
