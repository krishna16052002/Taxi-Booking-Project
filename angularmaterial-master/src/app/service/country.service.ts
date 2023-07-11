import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countryUrl = "http://localhost:8080/country"
  constructor(private http: HttpClient , private router:Router) { }


  getcountrydata(): Observable<any>{
    return this.http.get<any>("https://restcountries.com/v3.1/all")
  }
  getcountry(name:any): Observable<any>{
    return this.http.get<any>("https://restcountries.com/v3.1/name/"+name)
  }
  addcountry(countryformdata : any):Observable<any>{
    // console.log(countryformdata);

    return this.http.post<any>(this.countryUrl, countryformdata)
  }
  getcountrydatabasedata(): Observable<any>{
    return this.http.get<any>("http://localhost:8080/country")
  }

  getcountryData(query:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/countrydata?q=${query}`)
  }


}
