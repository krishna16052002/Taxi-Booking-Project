import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CityService {


  constructor(private http: HttpClient , private router:Router) { }

  getcountry(): Observable<any>{
    return this.http.get<any>("http://localhost:8080/country");
  }

  addcity(city:any):Observable<any>{
    return this.http.post<any>("http://localhost:8080/city",city );
  }

  getcity():Observable<any>{
    return this.http.get<any>("http://localhost:8080/city");
  }

  updatecity(city:any ,_id: any ): Observable<any> {
    return this.http.patch(`http://localhost:8080/city/`+_id , city)
  }

  getonlycity():Observable<any>{
    return this.http.get<any>("http://localhost:8080/allcity");
  }
}
