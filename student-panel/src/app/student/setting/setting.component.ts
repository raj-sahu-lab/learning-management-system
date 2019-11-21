import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { RegisterApiHelper } from '../../RestApiCall/ApiHelper/register.service';
import { ProfileService } from 'src/app/RestApiCall/ApiHelper/profile.service';
import { Router } from '@angular/router';
import { HelperService } from './../../RestApiCall/NetworkLayer/helper.service';
import { DashboardApiHelper } from './../../RestApiCall/ApiHelper/dashboard.service';
import { PaymentGateWayService } from './../../RestApiCall/ApiHelper/payment-gate-way.service';
import html2pdf from 'html2pdf.js';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { NgxImageCompressService} from 'ngx-image-compress';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import timezones from 'compact-timezone-list';
// import { minimalTimezoneSet } from 'compact-timezone-list';

@Component({
  selector: 'app-setting',
  providers: [RegisterApiHelper],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, OnDestroy {

  @ViewChild('content', { static: true }) content:ElementRef;
  @ViewChild('printPdf', {static: true}) pdfTable: ElementRef;
  studentData : any;

  image: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  gender: string;
  pincode: string;

  educationList= [];
  countryList= [];
  cityList= [];  
  countrySelected : any = 0;  
  citySelected : any = 0;
  educationSelected : any;

  instituteList = [];
  instituteIds = [];
  setPassword : any = '';
  confirmPassword : any = '';
  passwordMatch: boolean = true;
  userDetails : any;
  oldPassword : any = '';
  rating : number = 0;
  feedBackDescription : any;
  feedbackErrorMessage: string = '';
  passwordErrorMessage: string = '';
  profileSuccessMessage: string = '';
  profileErrorMessage: string = '';
  purchaseOrders: any;
  purchaseOrderSelected : any = {};
  private subscriptions: Subscription[] = [];
  timeZones = [];
  timeZoneSelected : any;

  constructor(public paymentGateWayService : PaymentGateWayService, public dashboardApiHelper : DashboardApiHelper, public helperService: HelperService, public router: Router, public httpURL: HttpClient,private toastr: ToastrService,protected serviceRegister: RegisterApiHelper, public profileService: ProfileService,private location: Location, private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.timeZones = timezones;
    this.studentInfo();
    this.education();
    // this.countryCity();
    this.purchaseDetails();
  }

  goBack(){
    this.location.back();
  }

  studentInfo(){

    this.subscriptions.push(this.profileService.getStudentInfo().subscribe((res: ServerResponse) => { 

      if (res != null && res.success && res.data != null) {
        localStorage.setItem('User', JSON.stringify(res.data));
        this.timeZoneSelected = res.data.time_zone;
        this.studentData = JSON.parse(localStorage.getItem('User'));
        this.profileService.getCounteryCity().subscribe((res: ServerResponse) => { 
          if (res.success) {
            this.countryList = res.data;
            this.countryChanged();
          }
        },
          (err) => {
            this.toastr.error(err.error);
          });
        if(this.studentData.city){
          if(this.studentData.city.country){
            this.countrySelected = this.studentData.city.country.id;
          }
          this.citySelected = this.studentData.city.id;
          
        }
        if(!this.studentData.image){
          this.studentData.image = environment.baseUrl+"assets/img/icons/default_profile.png"
        }
        //this.educationSelected = res.data.educationType;
        
      }
    },
      (err) => {
  
        console.log(err);
      }));
  }

  uploadImage(event : any){
    
    var  fileName : any;
    if (event.target.files && event.target.files[0]) {
        fileName = event.target.files[0]['name'];
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.compressImage(event.target.result,fileName)
        }
        reader.readAsDataURL(event.target.files[0]);

    }

    
  }

  compressImage(image,fileName){
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(',')[1]);
        
        //imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    
        this.subscriptions.push(this.profileService.profilePhoto(imageFile).subscribe((res: ServerResponse) => {
          if(res.success){
            localStorage.setItem('User', JSON.stringify(res.data));
            this.studentData = JSON.parse(localStorage.getItem('User'));
            this.helperService.userImage();
          }
        },
        (err) => {
          this.toastr.error(err.error);
        }));
        
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

  education(){
    
    this.subscriptions.push(this.profileService.getEduaction().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.educationList = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  // countryCity() {
    // this.profileService.getCounteryCity().subscribe((res: ServerResponse) => { 
        
    //   if (res.success) {
    //     this.countryList = res.data;
    //   }
    // },
    //   (err) => {
    //     this.snotify.body = err.error;
    //     this.snotify.onError();
    //   });
  // }

  purchaseDetails(){
    this.subscriptions.push(this.paymentGateWayService.getPurchaseOrderList().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.purchaseOrders = res.data;
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  orderSelected(orderDetails : any){
    
    this.purchaseOrders.forEach(order => {
      if (orderDetails.id == order.id) {
        this.purchaseOrderSelected.transactionId = order.payments.transactionId;
        this.purchaseOrderSelected.date = order.purchasedAt;
        this.purchaseOrderSelected.amount = order.payments.amount;
        this.purchaseOrderSelected.currency = order.payments.currency;
        this.purchaseOrderSelected.title = order.detail.title;
        this.purchaseOrderSelected.instituteName = order.detail.account.title;
        this.purchaseOrderSelected.instituteLogo = order.detail.account.image;
        if(orderDetails.type == 1){
          this.purchaseOrderSelected.type = 'subject';
        } else if (orderDetails.type == 2){
          this.purchaseOrderSelected.type = 'topic';
        } else if (orderDetails.type == 3){
          this.purchaseOrderSelected.type = 'Content';
        } else if (orderDetails.type == 4){
          this.purchaseOrderSelected.type = 'Test';
        } else if (orderDetails.type == 5){
          this.purchaseOrderSelected.type = 'Practice';
        } else if (orderDetails.type == 6){
          this.purchaseOrderSelected.type = 'PDF';
        } else if (orderDetails.type == 7){
          this.purchaseOrderSelected.type = 'PPT';
        } else if (orderDetails.type == 8){
          this.purchaseOrderSelected.type = 'Audio';
        } else if (orderDetails.type == 9){
          this.purchaseOrderSelected.type = 'Video';
        }
      }
    });
  }

  InstituteLists(){
    this.subscriptions.push(this.dashboardApiHelper.getAllInstituteList().subscribe((res: ServerResponse) => { 
        
      if (res.success) {
        this.instituteList = res.data;
        const user = JSON.parse(localStorage.getItem('User'));
        const slectedInstitiue = user.instituteList;
        this.instituteList.forEach(institute => {
          slectedInstitiue.forEach(setedInstiute => {
            if(setedInstiute.branch_id == institute.id){
              institute.selected = true;
            }
          });
        });
      }
    },
      (err) => {
        this.toastr.error(err.error);
      }));
  }

  countryChanged() {
    
    this.countryList.forEach(country => {

      if(this.countrySelected == country.id){
        
        this.cityList = country.citys;  
              
      }
  });

  }
  
  instituteChecked(id,event) {

    if (event.target.checked) {

      this.instituteIds.push(id);
    }

    if (!event.target.checked) {

      let index = this.instituteIds.indexOf(id);

      if (index > -1) {

        this.instituteIds.splice(index, 1);
      }
    }
  }

  submitButtonClick()
  {
      let instituteData:{[k: string]: any} = {
      
        instituteIdList: this.instituteIds
      };
      
      this.subscriptions.push(this.serviceRegister.addInstitutes(instituteData).subscribe((res: ServerResponse) => {
        
        if(res.success){
          this.studentInfo();
          let closeAddInstitute: HTMLElement = document.getElementById('closeInstitute') as HTMLElement;
          closeAddInstitute.click();
        }
        
        
      },
        (err) => {
         console.log(err);

        }));
  }

  changePassword(){

    if(this.oldPassword=='' || !this.oldPassword){
      this.passwordErrorMessage = "Please enter old password";
    }else if (this.setPassword=='' || !this.setPassword){
      this.passwordErrorMessage = "Please enter set password";
    }else if (this.confirmPassword=='' || !this.confirmPassword){
      this.passwordErrorMessage = "Please enter confirm password";
    }else if(this.setPassword.length < 6 || this.setPassword.length > 16){
        this.passwordErrorMessage = 'password must be minimum 6 characters and maximum 16 characters';
    } else if(this.setPassword.search(/\d/) == -1){
        this.passwordErrorMessage = 'password must contain number';
    } else if(this.setPassword.search(/[a-zA-Z]/) == -1){
        this.passwordErrorMessage = 'password must contain letter';
    } else if(this.setPassword.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == -1){
        this.passwordErrorMessage = 'password must contain special character';
    }else if (this.setPassword != this.confirmPassword){
      this.passwordErrorMessage = "Set password and Confirm password do not match";
    }else if((this.setPassword == this.confirmPassword)){
      this.passwordErrorMessage = '';
      this.passwordMatch = true;
      let data = {
        'oldPassword' : this.oldPassword,
        'password' : this.setPassword,
        'confirmPassword' : this.confirmPassword
      }
      
      this.subscriptions.push(this.profileService.changePassword(data).subscribe((res: ServerResponse) => {
        if (res.success) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      },
      (err) => {
        this.passwordErrorMessage = err.error;
        this.toastr.error(err.error);
      }));
    } else this.passwordErrorMessage = "Some error";

    
    
  }

  postFeedBack(){
    if(this.feedBackDescription && this.rating){

      let data = {
        'ratting' : this.rating,
        'description' : this.feedBackDescription 
      }
      
      this.subscriptions.push(this.profileService.postFeedBack(data).subscribe((res: ServerResponse) => {
        
        if (res.success) {
          this.feedbackErrorMessage = '';
          this.rating = 0;
          this.feedBackDescription = '';
          
          this.studentInfo();
        }
      },
        (err) => {
          this.feedbackErrorMessage = err.error;
          this.toastr.error(err.error);
        }));
    } else if(!this.rating){
      this.feedbackErrorMessage = "Please select rating";
    } else if(!this.feedBackDescription){
      this.feedbackErrorMessage = "Please write something";
    }
  }

  setRating(rate){
    this.rating = rate;
  }

  updateProfile(){
    
    let data : any = {
      'firstName' : this.studentData.firstName,
      'lastName' : this.studentData.lastName
    }
    if(this.studentData.gender){
      data.gender = this.studentData.gender;
    }
    if(this.studentData.pincode){
      data.pincode = this.studentData.pincode;
    }
    if(this.studentData.email){
      data.email = this.studentData.email;
    }
    if(this.studentData.educationType > 0){
      data.educationType = this.studentData.educationType;
    }
    if(this.countrySelected > 0){
      data.countryId = this.countrySelected;
    }
    if(this.citySelected > 0){
      data.cityId = this.citySelected;
    }
    if(this.timeZoneSelected){
      data.timeZone = this.timeZoneSelected;
    }
    
    this.subscriptions.push(this.profileService.setProfileInfo(data).subscribe((res: ServerResponse) =>{
      
      if(res.success){
        localStorage.setItem('User', JSON.stringify(res.data));
        this.studentData = JSON.parse(localStorage.getItem('User'));
        this.profileErrorMessage = '';
      }
    },
    (err) => {
      this.profileErrorMessage = err.error;
      this.toastr.error(err.error);
    }));
  }

  public downloadAsPDF(pdfData) {
    var element = document.getElementById('printPdf');
    var opt = {
      margin : 1,
      filename:     pdfData.transactionId+'.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();

    // const pdfTable = this.pdfTable.nativeElement;

    // let pdf = new jsPDF('p', 'mm', [400,400]);
    // pdf.addHTML(pdfTable, function() {
    //   pdf.save(pdfData.transactionId+'.pdf');
    // });
  }

  corousel(){
    $(document).ready(function () {
      
      $('#carousel-example').on('slide.bs.carousel', function (e) {
        
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $('.carousel-item').length;
        
        if (idx >= totalItems-(itemsPerSlide-1)) {
            var it = itemsPerSlide - (totalItems - idx);
            
            for (var i=0; i<it; i++) {
                // append slides to end
                if (e.direction=="left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                }
                else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
      });
    });
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.forEach(subscription => {
        if(subscription){
          subscription.unsubscribe();
        }
      });
    }
  }
  
}