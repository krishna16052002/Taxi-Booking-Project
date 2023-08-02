import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreaterideService {

  constructor(private http: HttpClient , private router:Router) { }

  getuser(): Observable<any>{
    return this.http.get("http://localhost:8080/user");
  }


  getServiceType(cityId: any) {
    // console.log(cityId)
    return this.http.get<any>(`http://localhost:8080/vehiclepricing/${cityId}`);
  }


  addcreateride(createridedata:any ):Observable<any>{
    return this.http.post(`http://localhost:8080/createride` , createridedata);
  }

  getridedata():Observable<any>{
    return this.http.get('http://localhost:8080/createride');
  }

  deleteride(_id: any): Observable<any> {
    return this.http.delete(`http://localhost:8080/createride/`+ _id)
  }

  updateride(feedbackdata : any ):Observable<any>{
    console.log(feedbackdata);

    return this.http.patch('http://localhost:8080/createride' , feedbackdata );
  }


  checkuserdetails(data :any ): Observable<any>{
    return this.http.post('http://localhost:8080/checkuserdetails' , data );
  }

  checkvehiclepricing(data : any ) : Observable <any > {
    return this.http.post('http://localhost:8080/checkvehiclepricing' , data)
  }

  // getridedata(queryParams:any ): Observable<any> {
  //   console.log(queryParams , "confirmridedata");

  //   return this.http.get<any>( 'http://localhost:8080/createride' ,  queryParams );
  // }



getdowloadcsvalldata(){
  return this.http.get<any>("http://localhost:8080/downloadcsv")
  }


  ridehistory(data:any): Observable<any> {
// console.log(data);


    const params = {
      cashCard: data.data.cashCard,
      dropoffLocation:data.data.dropoffLocation,
      pickupLocation:data.data.pickupLocation,
      fromdate:data.data.fromdate,
      todate:data.data.todate,
      status:data.data.status,
      vehicle_id:data.data.vehicle_id,
    };
  return this.http.get(`http://localhost:8080/ridehistory`, {params});
}
}
