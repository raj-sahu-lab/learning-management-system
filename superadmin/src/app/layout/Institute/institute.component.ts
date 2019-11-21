import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { NumberFormatStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InstituteApiHelper } from '../../RestApiCall/ApiHelper/institute.service';
import { CurrenyApiHelper } from '../../RestApiCall/ApiHelper/curreny.service';
import { appApiResources } from './../../RestApiCall/ApiHelper/app.constants';
declare var $: any;
import { HelperService } from '../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-institute',
  providers: [InstituteApiHelper],
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {

  filter = false;

  selectedDescription: any;
  isEdit = false;

  image = '';
  selectedInstituteImage: any;
  selectedInstituteFile: any;

  countryList= [];
  cityList= [];
  instituteList = [];
  instituteId = null;

  currencyList = [];
  currencyId = undefined;

  name = '';
  countryCode = undefined;
  contactnumber = '';
  email = '';
  countryId = undefined;
  cityId= undefined;
  pinCode = '';
  domain = '';
  // firebaseApiKey = '';
  password = '';
  isMarketplaceEnable = undefined;
  accessLevel = undefined;
  status = null;
  isEnabled = null;

  searchBox = '';

  columImage = true;
  columName = true;
  columNumber = true;
  columEmail = true;
  columDomain = true;
  columPlan = false;
  columCDate = false;
  columPDate = false;
  columActive = true;
  columCountry = false;
  columCity = false;
  columPincode = false;
  columMarketPlace = false;
  columALevel = false;
  columAToken = false;

  constructor(protected serviceCurreny: CurrenyApiHelper,public httpURL: HttpClient,protected serviceInstitute: InstituteApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.currency();
    this.institutes();
    this.countryCity();
  }

  currency() {

    this.serviceCurreny.getCurrencyList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {

        this.currencyList = res.data;
        this.helperService.loadDataTable();

      }
    },
      (err) => {

        console.log(err);
      });
  }

  dropDownFilter(){
    this.filter = !this.filter;
  }

  institutes() {

      this.serviceInstitute.getInstituteList().subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
        
        this.instituteList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });

  }

  countryCity() {

    const allCountry = appApiResources.countryCityList;

    this.httpURL.get(allCountry).subscribe((res: ServerResponse) => {

      this.countryList = res.data;

    },
      (err) => {

        console.log(err);
      });

  }

  countryChanged(){

    this.cityId = undefined;

    this.countryList.forEach(country => {

      if(this.countryId == country.id) {

        this.cityList = country.citys;
        this.countryCode = country.code;
      }
    });

  }

  instituteFileChanged(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {

      this.selectedInstituteFile = fileInput.target.files[0];
      const reader = new FileReader();

      reader.onload = ((e) => {

        this.selectedInstituteImage = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  validateEmail(email) {
      let re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

  submitButtonClick() {

    //console.log((this.domain).replace(" ", ""));

    if (this.selectedInstituteImage == null && this.isEdit == false) {

      this.snotify.body = 'Please select an image.';
      this.snotify.onError();

    } else if (this.name == '') {

      this.snotify.body = 'Please enter institute name.';
      this.snotify.onError();

    } else if (this.email == '') {

      this.snotify.body = 'Please enter an email address.';
      this.snotify.onError();

    } else if (!this.validateEmail(this.email)) {

      this.snotify.body = 'Please enter valid email address.';
      this.snotify.onError();

    } else if (this.domain == '') {

      this.snotify.body = 'Please enter domain name.';
      this.snotify.onError();

    } else if (this.password == '') {

      this.snotify.body = 'Please enter password.';
      this.snotify.onError();

    } else if(this.password.length < 6 || this.password.length > 16) {

      this.snotify.body = 'Passowrd must be minimum 6 characters and maximum 16 characters.';
      this.snotify.onError();

    } else if(this.password.search(/\d/) == -1) {

        this.snotify.body = 'Passowrd must contain number.';
        this.snotify.onError();

    } else if(this.password.search(/[a-zA-Z]/) == -1) {

        this.snotify.body = 'Passowrd must contain letter.';
        this.snotify.onError();

    } else if(this.password.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1) {

      this.snotify.body = 'Passowrd must contain special character.';
      this.snotify.onError();

    } else {

      let institute: { [k: string]: any } = {

        title: this.name,
        countryCode: this.countryCode,
        phone: this.contactnumber,
        email: this.email,
        countryId: this.countryId,
        cityId: this.cityId,
        pinCode: this.pinCode,
        domain: ((this.domain).replace(" ", "")+".example.com"),
        password: this.password,
        isMarketplaceEnable: this.isMarketplaceEnable,
        accessLevel: this.accessLevel,
        currencyId: this.currencyId,
      };

      this.serviceInstitute.addInstitute(this.selectedInstituteFile, institute).subscribe((res: ServerResponse) => {
        
        if (res.success && res.data != null) {
          
          this.snotify.body = res.message;
          this.snotify.onSuccess();

          this.instituteList.unshift(res.data);
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

  editButtonClick(instituteId) {

    const institute = this.instituteList.find(obj => obj.account_id == instituteId);
    this.instituteId = instituteId;

    if(institute.status == 0) {
      this.status = 1;

    } else {

      this.status = 0;

    }

    this.editButtonProcess();

  }

  editButtonProcess() {

    const institute: { [k: string]: any } = {

      status: this.status,
      accountId: this.instituteId,
    };

    this.serviceInstitute.updateInstitute(institute).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.instituteList[this.instituteList.findIndex(obj => obj.account_id === this.instituteId)] = res.data;
        this.helperService.loadDataTable();
        this.cancelEditClick();
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

      });

  }

  isEnabledButtonClick(instituteId) {

    const institute = this.instituteList.find(obj => obj.account_id == instituteId);
    this.instituteId = instituteId;

    if(institute.accessToken == null) {
      this.isEnabled = 1;

    } else {

      this.isEnabled = 0;

    }

    this.isEnabledButtonClickProcess();

  }

  isEnabledButtonClickProcess() {

    const institute: { [k: string]: any } = {

      isEnabled: this.isEnabled,
      accountId: this.instituteId,
    };

    this.serviceInstitute.isEnabledInstitute(institute).subscribe((res: ServerResponse) => {

      this.snotify.body = res.message;
      this.snotify.onSuccess();

      if (res.success && res.data != null) {

        this.instituteList[this.instituteList.findIndex(obj => obj.account_id === this.instituteId)] = res.data;
        this.helperService.loadDataTable();
        this.cancelEditClick();
      }
    },
      (err) => {

        this.snotify.body = err.error;
        this.snotify.onError();

      });

  }

  cancelEditClick() {

    this.isEdit = false;
    this.image = '';
    this.selectedInstituteImage = null;
    this.instituteId = null;
    this.name = '';
    this.countryCode = undefined;
    this.countryId = undefined;
    this.cityId = undefined;
    this.contactnumber = '';
    this.email = '';
    this.domain = '';
    this.password = '';
    this.isMarketplaceEnable = undefined;
    this.accessLevel = undefined;
    this.currencyId = undefined;
    this.status = null;
    this.isEnabled = null;

  }

  deleteButtonClick(instituteId) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete institute?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceInstitute.deleteInstitute(instituteId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.instituteList.splice(this.instituteList.findIndex(obj => obj.account_id === instituteId), 1);
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
