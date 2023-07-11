import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient, private router: Router) { }

  getcountrydatabasedata(): Observable<any>{
    return this.http.get<any>("http://localhost:8080/country")
  }

  getcity():Observable<any>{
    return this.http.get<any>("http://localhost:8080/city");
  }

  adddriver(driverFormdata: any) {
    console.log(driverFormdata);
    return this.http.post<any>("http://localhost:8080/driver", driverFormdata)
  }

  getcountry(name:any): Observable<any>{
    return this.http.get<any>("https://restcountries.com/v3.1/name/"+name)
  }

  getdriver(): Observable<any> {
    return this.http.get("http://localhost:8080/driver");
  }

  updatedriver(driver: any, _id: any): Observable<any> {
    return this.http.patch(`http://localhost:8080/driver/`+ _id, driver)
  }
  deletedriver(_id: any): Observable<any> {
    return this.http.delete(`http://localhost:8080/driver/`+ _id)
  }

  changedriverstatus(driver:any) {
    return this.http.patch('http://localhost:8080/changeDriverStatus', driver);
  }

  // assignservices(service:any){
  //   return this.http.post('http://localhost:8080/services', service)
  // }
  assignservices( _id: any , service: any): Observable<any> {
    console.log(_id);
    console.log(service);


    return this.http.post(`http://localhost:8080/services/`+ _id, service)
  }

  // getdriverpagination(page: number, limit: number): Observable<any> {
  //   // console.log(page);
  //   // console.log(limit);
  //   return this.http.get(`http://localhost:8080/driver/driverdata?page=${page}&limit=${limit}`);
  // }



  getDriverData(page: number, limit: number, search?: string, sortfield?: string, sortorder?: string): Observable<any> {
    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      search: search || '',
      sortfield: sortfield || '',
      sortorder: sortorder || ''
    };

    return this.http.get<any>("http://localhost:8080/driverdata", { params: queryParams });
  }
}
