import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { appApiResources } from './app.constants';
import { HelperService } from '../NetworkLayer/helper.service';
import { BaseService } from '../NetworkLayer/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomErrorHandlerService } from '../NetworkLayer/custom-error-handler.service';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class normalChatApiHelper {

  readonly url : string = environment.chatSocket;
  constructor(public baseService: BaseService, public helperService: HelperService, public errorHandler: CustomErrorHandlerService, private socket: Socket) { }

  getChatStudentList(): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('logintoken'));
    headers = headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers = headers.set('Pragma', 'no-cache, no-store, must-revalidate');
    
    return this.baseService.get(appApiResources.normalChat, headers).pipe(
      map((res: Response) => res),
      catchError((error: HttpErrorResponse) => throwError(error.error) )
    );
  }

  listen(eventName : string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data)=>{
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }

  joinEmit(eventName: string, data:  any){
    this.socket.emit(eventName, data);
  }

  joinListen(eventName : string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName, (data)=>{
        subscriber.next(data);
      })
    })
  }

  leaveChat(eventName : string, data:  any){
    this.socket.emit(eventName, data);
  }
  
}
