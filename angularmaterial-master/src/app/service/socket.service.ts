import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket;
  constructor() {
    this.socket = io('http://localhost:8080');
  }

  // emit  cityid and serviceid for the check  $match condition
  emaitassigndriverdata(eventData: any): void {
    console.log(eventData);

    this.socket.emit('assigndriverdata', eventData);
  }
  //  assign driverdata in confirmride ,
  onassigndriverdata(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('assigndriverdata', (data) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }
  //
  emitchangedriverstatus(statusdata: any) {
    this.socket.emit('changedriverstatus', statusdata);
  }

  // Listen for the 'driverstatuschanged' event from the server

  onDriverStatusChanged(driverstatuschanged: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(driverstatuschanged, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  // emit the driver vehicle data to the server

  emitchangedrivervehicletype(vehicledata: any) {
    // console.log(vehicledata);

    this.socket.emit('changevehicletype', vehicledata);
  }

  // Listen for the 'changevehicletype' event from the server

  onchangedrivervehicletype(changevehicletype: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(changevehicletype, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  // emit the assign driver

  assigndriver(data: any) {
    // console.log(data);
    this.socket.emit('assigndriver', data);
  }

  assigndriverchange(assigndriver: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(assigndriver, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  // emit the data

  emitridedata(data: any) {
    // console.log(data);
    this.socket.emit('runningrequest', data);
  }

  // running requst data

  onrunningrequest(runningrequest: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('runningrequest', (data) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  // emit the rejected ride data
  emitrejectedride(data: any) {
    // console.log(data);
    this.socket.emit('riderejected', data);
  }

  //  after ride id null then on this data

  onrejectedride(riderejected: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(riderejected, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  // emit the cancel ride data
  emitcancelride(data: any) {
    // console.log(data);
    this.socket.emit('cancelride', data);
  }

  //  after ride id null then on this data

  oncancelride(cancelride: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(cancelride, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }

  //  emit the ridehistorydata
  emitridehistory(data: any) {
    // console.log(data);

    this.socket.emit('ridehistory', data);
  }

  //  after ride id null then on this data

  onridehistory(ridehistory: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ridehistory, (data: any) => {
        observer.next(data);
      });
    });
  }

  //  emit assign nearest driver data
  emaitassignnearestdriverdata(eventData: any): void {
    this.socket.emit('assignnearestdriverdata', eventData);
  }

  // on assign nearest driver data
  onassignnearestdriverdata(
    afterassignnearestdriverdata: any
  ): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(afterassignnearestdriverdata, (data: any) => {
        observer.next(data);
      });
    });
  }

  afterselectdriver(afterselectdriver: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(afterselectdriver, (data: any) => {
        observer.next(data);
        // console.log(data);
      });
    });
  }

  afternulldriverdata(afternulldriverdata: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(afternulldriverdata, (data: any) => {
        observer.next(data);
        // console.log(data);
      });
    });
  }

  // afternullridedata(afternullridedata:any):Observable<any>{
  //   return new Observable((observer)=>{
  //     this.socket.on(afternullridedata ,(data:any) =>{
  //       observer.next(data);
  //     })
  //   })
  // }

  updateride(updateride:any):Observable<any>{
    return new Observable((observer)=>{
      this.socket.on(updateride ,(data:any) =>{
        observer.next(data);
      })
    })
  }

  emitaccepted(accepted:any ) : void {
    this.socket.emit('accepted', accepted);
  }

  arrived(arrived:any):void {
    console.log(arrived);

    this.socket.emit('arrived' , arrived);
  }

  picked(picked:any):void {
    this.socket.emit('picked', picked);
  }

  started(started:any){
    this.socket.emit('started', started);
  }

  Completed(Completed:any){
    this.socket.emit('Completed',Completed);
  }

  emitconfirmride(data: any){
    console.log(data);

    this.socket.emit('confirmride', data);
  }



  afterconfirmridedata(afterconfirmridedata: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(afterconfirmridedata, (data: any) => {
        observer.next(data);
      });
    });
  }


  oncronedata(cronedata: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(cronedata, (data: any) => {
        // console.log(data);
        observer.next(data);
      });
    });
  }


}
