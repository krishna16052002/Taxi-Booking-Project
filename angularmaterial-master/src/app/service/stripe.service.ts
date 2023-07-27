import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http :HttpClient) { }


  getcard(id:any ){
    console.log(id);
    return this.http.get('http://localhost:8080/get-card/' + id)
  }

  deletecard(id:any){
    return this.http.delete('http://localhost:8080/deletecard/' + id)
  }

}
