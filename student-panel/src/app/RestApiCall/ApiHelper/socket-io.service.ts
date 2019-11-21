import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  // socket : any;
  readonly url : string = environment.chatSocket;

  constructor(private socket: Socket) { 
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
