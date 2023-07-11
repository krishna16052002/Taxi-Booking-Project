import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var google: any;
@Component({
  selector: 'app-ridehistoryinfo',
  templateUrl: './ridehistoryinfo.component.html',
  styleUrls: ['./ridehistoryinfo.component.css'],
})
export class RidehistoryinfoComponent {
  ridedata: any;
  usersdata: any;
  vehicledata: any;
  citydata: any;
  map: any;
  startinglocation: any;
  destinationlocation: any;
  geocoder: any;
  directionsService: any;
  directionsRenderer: any;
  startingplace: any;
  destinationplace: any;
  polyline: any;


  constructor(
    public dialogRef: MatDialogRef<RidehistoryinfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ridedata,
    private zone : NgZone

  ) { this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer(); }
  ngOnInit() {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 22.3039, lng: 70.8022 },
        zoom: 8,
      }
    );
    // console.log(this.data);
    this.ridedata = this.data.ridedata;
    // console.log(this.ridedata);
    this.usersdata = this.ridedata.userdata;
    // console.log(this.usersdata);
    this.vehicledata = this.ridedata.vehicledata;
    // console.log(this.vehicledata);
    this.citydata = this.ridedata.citydata;
    // console.log(this.citydata);
    this.drawPath()
  }

  drawPath() {
    this.startinglocation = this.ridedata.startlocation;
      console.log(this.startinglocation);

      this.destinationlocation = this.ridedata.destinationlocation;
      console.log(this.destinationlocation);

    this.geocoder = new google.maps.Geocoder();
    this.geocodeAddress(this.startinglocation, 'start');
    this.geocodeAddress(this.destinationlocation, 'destination');
  }

  geocodeAddress(address: string, type: string): void {
    this.geocoder.geocode({ address },(results: any, status: any) => {
      if (status === 'OK' && results.length > 0) {
        this.zone.run(() => {
          if (type === 'start') {
            this.startingplace = results[0].geometry.location;
          } else if (type === 'destination') {
            this.destinationplace = results[0].geometry.location;
          }

          if (this.startingplace && this.destinationplace) {
            this.drawPolyline();
          }
        });
      } else {
        console.error('Geocode was not successful ' + status);
      }
    });
  }


  drawPolyline() {
    this.polyline = new google.maps.Polyline({
      path: [this.startingplace, this.destinationplace],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    const startMarker = new google.maps.Marker({
      position: this.startingplace,
      map: this.map,
      title: 'Starting Location'
    });

    const destinationMarker = new google.maps.Marker({
      position: this.destinationplace,
      map: this.map,
      title: 'Destination Location'
    });

    this.polyline.setMap(this.map);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
export interface Ridedata {
  ridedata: String;
}
