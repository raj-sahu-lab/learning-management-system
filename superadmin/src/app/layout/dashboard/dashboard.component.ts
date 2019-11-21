import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../RestApiCall/NetworkLayer/toast-notification.service';
import { HelperService } from '../../RestApiCall/NetworkLayer/helper.service';
import { DashboardApiHelper } from '../../RestApiCall/ApiHelper/dashboard.service';

import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CurrenyApiHelper } from '../../RestApiCall/ApiHelper/curreny.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    currencyList = [];

    institutePlanDetails = [];
    instituteCount = [];
    smsCount = [];
    emailCount = [];
    expiredInstitutes = [];
    expiredInstituteInWeek = [];

    instituteIncomeCurrencyTitle = "Dollar";
    instituteIncomeCurrency = "2";
    instituteIncomeYear = "2021";
    instituteIncomeChartDisplay:boolean = false;
    instituteIncomeChartLabels : any = [];
    instituteIncomeChartData : any = [];
    instituteIncomeChartType = 'bar';
    instituteIncomeChartOptions: ChartOptions = {
        responsive: true
    };

    studentIncomeCurrencyTitle = "Dollar";
    studentIncomeCurrency = "2";
    studentIncomeYear = "2021";
    studentIncomeChartDisplay:boolean = false;
    studentIncomeChartLabels : any = [];
    studentIncomeChartData : any = [];
    studentIncomeChartType = 'line';
    studentIncomeChartOptions: ChartOptions = {
        responsive: true
    };

    studentRegisterYear = "2021";
    studentRegisterChartDisplay:boolean = false;
    studentRegisterChartLabels : any = [];
    studentRegisterChartData : any = [];
    studentRegisterChartType = 'line';
    studentRegisterChartOptions: ChartOptions = {
        responsive: true
    };

    constructor( protected serviceCurreny: CurrenyApiHelper,protected serviceDashboard: DashboardApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

    ngOnInit() {

        this.currency();
        this.countInstitute();
        this.countSMS();
        this.countEmail();
        this.expiredInstitute();
        this.expiredInstitutesInWeek();
        this.instituteIncome();
        this.studentIncome();
        this.studentRegistered();
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

    expiredInstitute(){
        this.serviceDashboard.getExpiredInstitute().subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {
                this.expiredInstitutes = res.data;;
            }
        },
        (err) => {
    
            console.log(err);
        });
    }

    expiredInstitutesInWeek(){
        this.serviceDashboard.getExpiredInstitutesInWeek().subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {
                this.expiredInstituteInWeek = res.data;
            }
        },
        (err) => {
    
            console.log(err);
        });
    }

    instituteIncome(){

        const yearData: { [k: string]: any } = {
            year: this.instituteIncomeYear,
            currency: this.instituteIncomeCurrency,
        };

        this.currencyList.forEach(currency => {

            if (this.instituteIncomeCurrency == currency.id) {
              this.instituteIncomeCurrencyTitle = currency.title;
            }
        });
        
        this.serviceDashboard.totalInstitutetIncome(yearData).subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {

                this.instituteIncomeChartDisplay = true;
                this.instituteIncomeChartLabels = res.data.months;
                this.instituteIncomeChartData = [
                    { data: res.data.counts, label: this.instituteIncomeYear + ' - ' +this.instituteIncomeCurrencyTitle },
                ];
            }
        },
        (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();
        });

    }

    studentIncome(){

        const yearData: { [k: string]: any } = {
            year: this.studentIncomeYear,
            currency: this.studentIncomeCurrency,
        };

        this.currencyList.forEach(currency => {

            if (this.studentIncomeCurrency == currency.id) {
              this.studentIncomeCurrencyTitle = currency.title;
            }
        });
        
        this.serviceDashboard.totalStudentIncome(yearData).subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {

                this.studentIncomeChartDisplay = true;
                this.studentIncomeChartLabels = res.data.months;
                this.studentIncomeChartData = [
                    { data: res.data.counts, label: this.studentIncomeYear + ' - ' +this.studentIncomeCurrencyTitle },
                ];
            }
        },
        (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();
        });

    }

    studentRegistered(){

        const yearData: { [k: string]: any } = {
            year: this.studentRegisterYear
        };
        
        this.serviceDashboard.totalRegisterStudent(yearData).subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {

                this.studentRegisterChartDisplay = true;
                this.studentRegisterChartLabels = res.data.months;
                this.studentRegisterChartData = [
                    { data: res.data.counts, label: this.studentIncomeYear },
                ];
            }
        },
        (err) => {
            this.snotify.body = err.error;
            this.snotify.onError();
        });

    }

    countInstitute() {
        this.serviceDashboard.getInstituteCountList().subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {
                this.instituteCount = res.data;
            }
        },
        (err) => {
    
            console.log(err);
        });
        
    }

    countSMS() {

        this.serviceDashboard.getSMSCountList().subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {
                this.smsCount = res.data;
            }
        },
        (err) => {
    
            console.log(err);
        });
        
    }

    countEmail() {

        this.serviceDashboard.getEmailCountList().subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {
                this.emailCount = res.data;
            }
        },
        (err) => {
    
            console.log(err);
        });
        
    }
    
}
