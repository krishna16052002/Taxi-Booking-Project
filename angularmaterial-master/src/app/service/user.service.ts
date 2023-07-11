import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient , private router:Router) { }

  getcountrycodedata(): Observable<any>{
    return this.http.get<any>("https://restcountries.com/v3.1/all")
  }

  adduser(userformdata : any){
    console.log(userformdata);
    return this.http.post<any>("http://localhost:8080/user", userformdata)
  }


  getuser(): Observable<any>{
    return this.http.get("http://localhost:8080/user");
  }

  updateuser(user:any ,_id: any ): Observable<any> {
    return this.http.patch(`http://localhost:8080/user/`+_id , user)
}
  deleteuser(_id:any): Observable<any>{
    return this.http.delete(`http://localhost:8080/user/`+_id)
  }


  getuserpagination(page: number, limit: number): Observable<any> {
    // console.log(page);
    // console.log(limit);
    return this.http.get(`http://localhost:8080/user/userdata?page=${page}&limit=${limit}`);
  }

  searchuser(query:any): Observable<any>{
    return this.http.get(`http://localhost:8080/usersearch?q=${query}`);
  }

  // get data from database

  getUserData(page: number, limit: number, search?: string, sortfield?: string, sortorder?: string): Observable<any> {
    const queryParams = {
      page: page.toString(),
      limit: limit.toString(),
      search: search || '',
      sortfield: sortfield || '',
      sortorder: sortorder || ''
    };

    return this.http.get<any>("http://localhost:8080/user/userdata", { params: queryParams });
  }
}


