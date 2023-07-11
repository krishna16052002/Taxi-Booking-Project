import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {


  private vehicleUrl = "http://localhost:8080/vehicletype";
  constructor(private http: HttpClient , private _router: Router) { }

  addvehicle(vehicleformdata : any ){
    // console.log("hello");
    console.log(vehicleformdata);
    return this.http.post<any>(this.vehicleUrl , vehicleformdata);
  }

  getvehicledata(): Observable<any>{
    return this.http.get("http://localhost:8080/vehicletype");
  }

  // updatevehicledata(vehicle : any):Observable<any>{
  //   return this.http.patch("http://localhost:8080/vehicletype/{$}");
  // }

  updatevehicle(vehicleformdata:any ,_id: any ): Observable<any> {
    console.log(vehicleformdata);

    return this.http.patch(`http://localhost:8080/vehicletype/`+_id , vehicleformdata)
}
}
