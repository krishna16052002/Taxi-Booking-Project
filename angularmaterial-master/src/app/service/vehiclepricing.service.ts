import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VehiclepricingService {


  constructor(private http: HttpClient, private _router: Router) { }

  addpricing(vehiclepricingformdata: any) {
    console.log(vehiclepricingformdata);
    return this.http.post<any>("http://localhost:8080/vehiclepricing", vehiclepricingformdata)
  }

  getpricing(): Observable<any> {
    return this.http.get("http://localhost:8080/vehiclepricing");
  }

  getpricingpagination(page: number, limit: number): Observable<any> {
    console.log(page);
    console.log(limit);


    return this.http.get(`http://localhost:8080/vehiclepricing/data?page=${page}&limit=${limit}`);
  }

  updatepricing(pricing: any, _id: any): Observable<any> {
    return this.http.patch(`http://localhost:8080/vehiclepricing/` + _id, pricing)
  }
  deletepricing(_id: any): Observable<any> {
    return this.http.delete(`http://localhost:8080/vehiclepricing/` + _id)
  }
}
