import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Inject,
  OnDestroy
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { Router } from "@angular/router";
import { RedirectionService } from './../../RestApiCall/ApiHelper/redirection.service';
import { LiveClassService } from './../../RestApiCall/ApiHelper/live-class.service';
import { ServerResponse } from '../../RestApiCall/NetworkLayer/model.interface';
import { ToastrService } from 'ngx-toastr';
import {SESSION_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as moment from 'moment-timezone';

// #ad2121
const colors: any = {
  red: {
    primary: 'green',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: 'coral',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-liveclass',
  templateUrl: './liveclass.component.html',
  styleUrls: ['./liveclass.component.css']
})
export class LiveclassComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  redirectId: any;
  liveClasses: any;
  timeNow : any;
  count: any = 0;
  private subscription: Subscription;
  timeOffSet: any;
  user:any;
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService,public redirectionService: RedirectionService, private modal: NgbModal, public router: Router, public liveClassService : LiveClassService, private toastr: ToastrService, private location: Location) {
    this.getLiveClass();
   }

  ngOnInit() {
    this.user = this.storage.get('User');
    this.timeOffSet = moment().tz(this.user.time_zone).format('Z');
    // this.getLiveClass();
    this.timeNow = new Date();
   
  }

  goBack(){
    this.location.back();
  }
  

  getLiveClass(){
    this.subscription = this.liveClassService.getliveClassList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data) {
        this.liveClasses = res.data;
        this.liveClasses.forEach((data : any) => {
          var date = new Date(0);
          data.scheduleTime = date.setSeconds(data.scheduleTime);
          
          const value = {
            start: startOfDay(new Date(data.scheduleTime)),
            title: data.title,
            color: colors.yellow,
            data: data
          }
          
          data.formatedTime = new Date(data.scheduleTime);
          // data.formatedTime = new Date('2020-03-31T23:37');
          if(!((this.timeNow > data.formatedTime) && ((this.timeNow-60000*data.duration)>data.formatedTime))){
            this.count++;
          };
          
          this.events.push(value);
        });
        let closeInfo: HTMLElement = document.getElementsByClassName('cal-day-number')[15] as HTMLElement;
        
        closeInfo.click();
      }
    },
    (err) => {
      this.toastr.error(err.error);
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any): void {
    
    if(event.data){
      this.router.navigate(['./student/liveclassPage']).then(()=>{
        this.storage.set('liveClass', event.data);
      });
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  navigateUrl(classData){
    this.router.navigate(['./student/liveclassPage']).then(()=>{
      this.storage.set('liveClass', classData);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
