import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { ServerResponse } from './../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from './../../RestApiCall/NetworkLayer/toast-notification.service';

import { LearnerApiHelper } from './../../RestApiCall/ApiHelper/Learner.service';
import { DashboardApiHelper } from '../../RestApiCall/ApiHelper/Dashboard.service';
import { CurrencyApiHelper } from '../../RestApiCall/ApiHelper/Currency.service';

import { BaseService } from '../../RestApiCall/NetworkLayer/base.service';

import * as $ from 'jquery';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { TutorApiHelper } from '../../RestApiCall/ApiHelper/Tutor.service';
import { PaymentgatewayApiHelper } from '../../RestApiCall/ApiHelper/Paymentgateway.service';
import { ContentApiHelper } from '../../RestApiCall/ApiHelper/Content.service';
import { FeesApiHelper } from '../../RestApiCall/ApiHelper/Fees.service';

@Component({
    selector: 'app-dashboard',
    providers: [LearnerApiHelper, DashboardApiHelper, TutorApiHelper, PaymentgatewayApiHelper, ContentApiHelper, FeesApiHelper],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    currencyList = [];
    dashboardData: any;

    /*Line Chart.js*/

    contentLineChartDisplay: boolean = false;
    contentLineChartToday: number;
    contentLineChartWeek: number;
    contentLineChartMonth: number;
    contentLineChartYear: number;

    contentCurrencyId: any;
    contentType: any;

    contentLineChartLabels: any;
    contentLineChartData: any;
    contentLineChartType = 'line';
    // contentLineChartColors: Color[] = [
    //     {
    //         borderColor: 'rgba(23, 32, 42)',
    //     },
    //     {
    //         borderColor: 'rgba(100, 30, 22)',
    //     },
    //     {
    //         borderColor: 'rgba(81, 46, 95)',
    //     }
    // ];
    contentLineChartOptions: ChartOptions = {
        responsive: true
    };

    fileLineChartDisplay: boolean = false;
    fileLineChartToday: number;
    fileLineChartWeek: number;
    fileLineChartMonth: number;
    fileLineChartYear: number;

    fileCurrencyId: any;
    fileType: any;

    fileLineChartLabels: any;
    fileLineChartData: any;
    fileLineChartType = 'bar';
    // fileLineChartColors: Color[] = [
    //     {
    //         borderColor: 'rgba(27, 79, 114)',
    //     },
    //     {
    //         borderColor: 'rgb(247,156,137)',
    //     },
    //     {
    //         borderColor: 'rgba(20, 90, 50)',
    //     },
    //     {
    //         borderColor: 'rgba(125, 102, 8)',
    //     }
    // ];
    fileLineChartOptions: ChartOptions = {
        responsive: true,
        scales: { xAxes: [{}], yAxes: [{}] },
    };

    testLineChartDisplay: boolean = false;
    testLineChartToday: number;
    testLineChartWeek: number;
    testLineChartMonth: number;
    testLineChartYear: number;

    testCurrencyId: any;
    testType: any;

    testLineChartLabels: any;
    testLineChartData: any;
    testLineChartType = 'line';
    // testLineChartColors: Color[] = [
    //     {
    //         borderColor: 'rgba(110, 44, 0)',
    //     },
    //     {
    //         borderColor: 'rgba(123, 125, 125)',
    //     },
    //     {
    //         borderColor: 'rgba(77, 86, 86)',
    //     }
    // ];    
    testLineChartOptions: ChartOptions = {
        responsive: true
    };
    /*Line Chart.js*/

    /*Pie Chart.js*/
    contentPieChartDisplay: boolean = false;
    testPieChartDisplay: boolean = false;
    fileDoughnutChartDisplay: boolean = false;

    pieCurrencyId: any;
    pieType: any;

    contentPieChartLabels: any;
    contentPieChartData: any;
    contentPieChartType: ChartType = 'pie';
    // contentPieChartColors = [
    //     {
    //         backgroundColor: ['rgba(23, 32, 42)','rgba(100, 30, 22)','rgba(81, 46, 95)'],
    //     }
    // ];

    contentPieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, data) {
                    return 'Total active ' + data.datasets[0].data[tooltipItems.index];
                }
            }
        },
    };

    fileDoughnutChartLabels: any;
    fileDoughnutChartData: any;
    fileDoughnutChartType = 'doughnut';

    testPieChartLabels: any;
    testPieChartData: any;
    testPieChartType: ChartType = 'pie';
    // testPieChartColors = [
    //     {
    //         backgroundColor: ['rgba(27, 79, 114)','rgb(247,156,137)','rgba(20, 90, 50)','rgba(125, 102, 8)'],
    //     }
    // ];
    testPieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, data) {
                    return 'Total active ' + data.datasets[0].data[tooltipItems.index];
                }
            }
        },
    };
    /*Pie Chart.js*/

    public userType: number;
    public picture: string;
    public logoUpdate: boolean = false;
    public tutorCount: boolean = false;
    public paymentGatewayCount: boolean = false;
    public courseCount: boolean = false;
    public studentCount: boolean = false;
    public courseSold: boolean = false;


    constructor(public baseService: BaseService, protected serviceCurrency: CurrencyApiHelper, protected serviceFees: FeesApiHelper, protected serviceContent: ContentApiHelper, protected serviceTutor: TutorApiHelper, protected servicePaymentgateway: PaymentgatewayApiHelper, protected serviceLearner: LearnerApiHelper, protected serviceDashboard: DashboardApiHelper, public snotify: TostNotificationService) { }

    ngOnInit() {

        const User = JSON.parse(localStorage.getItem('User'));
        this.userType = User.userType;
        this.picture = User.account_image;
        if (this.picture.search('ic_company_logo.png') < 60) {
            this.logoUpdate = true;
        }

        if (this.userType == 1) {

            this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

                if (res != null && res.success && res.data != null) {

                    this.currencyList = res.data;

                    if (User.currency_id) {

                        this.pieCurrencyId = User.currency_id;
                        this.contentCurrencyId = User.currency_id;
                        this.fileCurrencyId = User.currency_id;
                        this.testCurrencyId = User.currency_id;

                    } else {

                        this.pieCurrencyId = 2;
                        this.contentCurrencyId = 2;
                        this.fileCurrencyId = 2;
                        this.testCurrencyId = 2;
                    }

                    // this.pieCurrencyId = res.data[0].id;
                    this.pieType = 'weekly';
                    this.pieChartData();

                    // this.contentCurrencyId = res.data[0].id;                   
                    this.contentType = 'weekly';
                    this.contentLineChart();

                    // this.fileCurrencyId = res.data[0].id;
                    this.fileType = 'weekly';
                    this.fileLineChart();

                    // this.testCurrencyId = res.data[0].id;
                    this.testType = 'weekly';
                    this.testLineChart();
                }
            },
                (err) => {
                    console.log(err);
                });
        }

        this.tutorListGet();
        this.paymentGateWayList();
        this.contentListGet();
        this.courseSoldListGet();
    }

    tutorListGet() {
        this.serviceTutor.getTutorList('0').subscribe((res: ServerResponse) => {

            if (res.success && res.data != null) {

                if (res.data.length > 0) {
                    this.tutorCount = true;
                }
            }
        },
            (err) => {

                console.log(err);
            });
    }

    paymentGateWayList() {
        this.servicePaymentgateway.getPaymentGateWayList().subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                if (res.data.gateWay.length > 0) {
                    this.paymentGatewayCount = true;
                }
            }
        },
            (err) => {

                console.log(err);
            });
    }

    contentListGet() {
        this.serviceContent.getContentList().subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {
                if (res.data.length > 0) {
                    this.courseCount = true;
                }
            }
        },
            (err) => {

                console.log(err);
            });
    }

    courseSoldListGet() {
        this.serviceFees.getpurchaseList().subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                if (res.data.length > 0) {
                    this.courseSold = true;
                }
            }
        },
            (err) => {

                console.log(err);
            });
    }

    contentLineChart() {

        const chart: { [k: string]: any } = {
            currencyId: this.contentCurrencyId,
            type: this.contentType
        };

        this.serviceDashboard.getDashboardData(chart).subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                this.contentLineChartDisplay = true;
                this.contentLineChartToday = res.data.amount.subject.today + res.data.amount.topic.today + res.data.amount.content.today;
                this.contentLineChartWeek = res.data.amount.subject.week + res.data.amount.topic.week + res.data.amount.content.week;
                this.contentLineChartMonth = res.data.amount.subject.month + res.data.amount.topic.month + res.data.amount.content.month;
                this.contentLineChartYear = (res.data.amount.subject.year) + (res.data.amount.topic.year) + (res.data.amount.content.year);

                this.contentLineChartLabels = res.data.chartLables;
                this.contentLineChartData = [
                    { data: res.data.chartData.subject.data, label: res.data.chartData.subject.lable },
                    { data: res.data.chartData.topic.data, label: res.data.chartData.topic.lable },
                    { data: res.data.chartData.content.data, label: res.data.chartData.content.lable }
                ];
            }
        },
            (err) => {

                console.log(err);
            });
    }

    fileLineChart() {

        const chart: { [k: string]: any } = {
            currencyId: this.fileCurrencyId,
            type: this.fileType
        };

        this.serviceDashboard.getDashboardData(chart).subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                this.fileLineChartDisplay = true;
                this.fileLineChartToday = res.data.amount.pdf.today + res.data.amount.ppt.today + res.data.amount.audio.today + res.data.amount.video.today;
                this.fileLineChartWeek = res.data.amount.pdf.week + res.data.amount.ppt.week + res.data.amount.audio.week + res.data.amount.video.week;
                this.fileLineChartMonth = res.data.amount.pdf.month + res.data.amount.ppt.month + res.data.amount.audio.month + res.data.amount.video.month;
                this.fileLineChartYear = res.data.amount.pdf.year + res.data.amount.ppt.year + res.data.amount.audio.year + res.data.amount.video.year;

                this.fileLineChartLabels = res.data.chartLables;
                this.fileLineChartData = [
                    { data: res.data.chartData.pdf.data, label: res.data.chartData.pdf.lable },
                    { data: res.data.chartData.ppt.data, label: res.data.chartData.ppt.lable },
                    { data: res.data.chartData.audio.data, label: res.data.chartData.audio.lable },
                    { data: res.data.chartData.video.data, label: res.data.chartData.video.lable }
                ];
            }
        },
            (err) => {

                console.log(err);
            });
    }

    testLineChart() {

        const chart: { [k: string]: any } = {
            currencyId: this.testCurrencyId,
            type: this.testType
        };

        this.serviceDashboard.getDashboardData(chart).subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                this.testLineChartDisplay = true;
                this.testLineChartToday = res.data.amount.practice.today + res.data.amount.test.today + res.data.amount.testBundle.today;
                this.testLineChartWeek = res.data.amount.practice.week + res.data.amount.test.week + res.data.amount.testBundle.week;
                this.testLineChartMonth = res.data.amount.practice.month + res.data.amount.test.month + res.data.amount.testBundle.month;
                this.testLineChartYear = res.data.amount.practice.year + res.data.amount.test.year + res.data.amount.testBundle.year;

                this.testLineChartLabels = res.data.chartLables;
                this.testLineChartData = [
                    { data: res.data.chartData.practice.data, label: res.data.chartData.practice.lable },
                    { data: res.data.chartData.test.data, label: res.data.chartData.test.lable },
                    { data: res.data.chartData.testBundle.data, label: res.data.chartData.testBundle.lable }
                ];
            }
        },
            (err) => {

                console.log(err);
            });
    }

    pieChartData() {

        const chart: { [k: string]: any } = {
            currencyId: this.pieCurrencyId,
            type: this.pieType
        };

        this.serviceDashboard.getDashboardData(chart).subscribe((res: ServerResponse) => {

            if (res != null && res.success && res.data != null) {

                this.dashboardData = res.data;
                this.contentPieChart();
                this.filePieChart();
                this.testPieChart();

                if (res.data.registeredStudent > 0) {
                    this.studentCount = true;
                }
            }
        },
            (err) => {

                console.log(err);
            });
    }

    contentPieChart() {

        this.contentPieChartDisplay = true;
        this.contentPieChartLabels = ['Subject', 'Topic', 'Content',];
        this.contentPieChartData = [
            this.dashboardData.activeCount.subject,
            this.dashboardData.activeCount.topic,
            this.dashboardData.activeCount.content,
        ];

    }

    filePieChart() {

        this.fileDoughnutChartDisplay = true;
        this.fileDoughnutChartLabels = ['PDF', 'PPT', 'Audio', 'Video'];
        this.fileDoughnutChartData = [
            [
                this.dashboardData.activeCount.pdf,
                this.dashboardData.activeCount.ppt,
                this.dashboardData.activeCount.audio,
                this.dashboardData.activeCount.video
            ]
        ];
    }

    testPieChart() {

        this.testPieChartDisplay = true;
        this.testPieChartLabels = ['Practice', 'Test', 'Bundle'];
        this.testPieChartData = [
            this.dashboardData.activeCount.practice,
            this.dashboardData.activeCount.test,
            this.dashboardData.activeCount.bundle,
        ];
    }
}