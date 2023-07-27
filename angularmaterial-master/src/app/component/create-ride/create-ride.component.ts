import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CityService } from 'src/app/service/city.service';
import { CreaterideService } from 'src/app/service/createride.service';
import { SettingService } from 'src/app/service/setting.service';
import { UserService } from 'src/app/service/user.service';
import { VehiclepricingService } from 'src/app/service/vehiclepricing.service';
declare var google: any;


@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css']
})
export class CreateRideComponent implements OnInit {


  @ViewChild('searchBox') searchBoxRef!: ElementRef;
  @ViewChild('destinationBox') destinationBoxRef!: ElementRef;
  @ViewChild("waypointInput") waypointInput: any;

  autocomplete: any;
  currentForm: string = 'firstForm';
  usercountrycodedata: any[] = [];
  createridesForm!: FormGroup;
  userdetailsform!: FormGroup;
  createWaypointGroup!: FormGroup;
  rideform!: FormGroup<any>;
  search: any;
  userdatabasedata: any[] = [];
  phonenumber: any;
  isButtonDisabled: boolean = true;
  phonenumberdatachecked: boolean = false;
  particularuserdata: any;
  username: any;
  isshow: boolean = false;
  nextshow: boolean = false;
  map: any;
  marker: any;
  inputValue: any;
  place: any;
  destinationAutocomplete: any;
  startingMarker: any;
  destinationMarker: any;
  destinationplace: any;
  startingplace: any;
  directionsService: any;
  directionsRenderer: any;
  user_id: any;
  waypointAutocomplete: any;
  waypointplace: any;
  settingdata: any;
  maximumstop: any;
  stop: any;
  citydata: any;
  startingplacecoordinates!: [number, number];
  coordinates: any;
  citynamedata: any[] = [];
  polygons: any[] = [];
  polygon: any;
  isInZone: boolean = false;
  cityIndex: any;
  stops: any[] = [];
  getroutebutton: boolean = true;
  abcdautocomplete: any;
  totalDistance: any;
  totalTime: any;
  estimateFare: any;
  vehiclesPricing: any;
  totalHours: any;
  totalMinutes: any;
  estimateTime: any;
  waypoints: any = [];
  stopsCounter: any = 0;
  countrycode: any;
  selectedvehicle: any;
  selectedOption: any;
  selectedDate: any;
  selectedTime: any;
  minDate: any;
  minTime: any;
  paymentoptions: any;
  ridetime: any;
  selectedDateTime: any;
  vehicle_id: any;
  vehiclepricingdata: any;
  city_id: any;
  starting: any;
  destination: any;
  destinationplacedata: any;
  userdetails: any;



  constructor(
    private _userservice: UserService,
    private formBuilder: FormBuilder,
    private _createrideservices: CreaterideService,
    private toaster: ToastrService,
    private _settingService: SettingService,
    private _cityServices: CityService,
    private http: HttpClient,
    private _createrideservice: CreaterideService,
    private _vehiclepricing: VehiclepricingService,
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnInit() {
    // this.fetchPolygonsFromDatabase()
    this._userservice.getuser().subscribe({
      next: (coutrycode: any) => {
        coutrycode.forEach((data: any) => {
          const countrycode = data.usercountrycode
          console.log(countrycode);

          this.usercountrycodedata.push(countrycode)
        });
        this.usercountrycodedata.sort();
      },
      error: (error) => {
        console.error(error);
      },
    });

    // this.toaster.success('Immediate message', '', { timeOut: 0 });

    this._settingService.getsetting().subscribe((response) => {
      this.settingdata = response;
      // console.log(response);
      const data = response.map((obj: any) => obj.maximumstop);
      // console.log(data[0]);
      // this.maximumstop = data[0];
      this.stops = data[0];
    });

    this._cityServices.getonlycity().subscribe((response) => {
      this.citydata = response;
      console.log(this.citydata);
    });

    this._createrideservices.getuser().subscribe((response) => {
      this.userdatabasedata = response;
      console.log(this.userdatabasedata);
    });

    this.createridesForm = this.formBuilder.group({
      countrycode: [''],
      phonenumber: [''],
      destinationlocation: [''],
      startinglocation: [''],
      waypointlocation: this.formBuilder.array([]),
      paymentoption: [''],
      vehicletype: [''],
      rideTime: [''],
      date: [''],
      time: ['']

      // dateTime: [this.getCurrentDateTime()]
    });

    this.userdetailsform = this.formBuilder.group({
      username: [''],
      userphonenumber: [''],
      useremail: [''],
    });

    this.createWaypointGroup = this.formBuilder.group({
      name: ['']
    })

    this.rideform = this.formBuilder.group({

    });

  }


  initMap() {
    // Initialize map
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 22.3039, lng: 70.8022 },
        zoom: 8,
      }
    );

    // this.directionsService = new google.maps.DirectionsService();
    // this.directionsRenderer = new google.maps.DirectionsRenderer({
    //   map: this.map,
    // });

    const markerPosition = { lat: 22.3039, lng: 70.8022 };
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: markerPosition, // Corrected property name to position
    });

    //  starting  autocomplete and that marker
    const startingbox = this.searchBoxRef.nativeElement;
    this.autocomplete = new google.maps.places.Autocomplete(startingbox);
    this.autocomplete.setFields(['geometry']);
    this.autocomplete.addListener('place_changed', () => {
      this.startingplace = this.autocomplete.getPlace();
      // this.starting = document.getElementById("startingpalce") as HTMLInputElement
      this.starting = this.searchBoxRef?.nativeElement.value;
      console.log(this.starting);
      console.log(this.startingplace);
      this._cityServices.getonlycity().subscribe((response) => {
        this.citydata = response;
        console.log(this.citydata);
        this.polygons = [];
        this.citydata.forEach((city: any) => {
          this.polygons.push(city.coordinates)
        })
        console.log(this.polygons);

        this.polygon = this.polygons.map(function (polygonCoordinates: any) {
          return new google.maps.Polygon({
            paths: polygonCoordinates
          });
        });

      }, (error) => {
        console.log(error);
        this.toaster.error(error.status, error.message)
      });

      this.location();
      //  starting input  box
      if (this.startingplace.geometry && this.startingplace.geometry.location) {
        this.startingplacecoordinates = [
          this.startingplace.geometry.location.lat(),
          this.startingplace.geometry.location.lng(),
        ];
        console.log('Selected coordinates:', this.startingplacecoordinates);
      }
    });


    //  destination box
    const destinationBox = this.destinationBoxRef.nativeElement;
    this.destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationBox
    );
    this.destinationAutocomplete.setFields(['geometry']);
    this.destinationAutocomplete.addListener('place_changed', () => {
      this.destinationplace = this.destinationAutocomplete.getPlace();
      console.log(this.destinationplace);
      this.destination = this.destinationBoxRef?.nativeElement.value;
      console.log(this.destination);
    });

    //  way point input box
    let waypoints = document.getElementById("waypoint") as HTMLInputElement;
    const waypointsAutocomplete = new google.maps.places.Autocomplete(waypoints);
  }

  async location() {
    // check the location in polygon
    if (this.polygon?.length != 0) {
      const geocoder = new google.maps.Geocoder();

      setTimeout(() => {
        let input = document.getElementById("startingpalce") as HTMLInputElement
        console.log(input.value);
        geocoder.geocode({ address: input.value }, (results: any, status: any) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            console.log(location);
            this.isInZone = false;
            for (var i = 0; i < this.polygon.length; i++) {
              if (google.maps.geometry.poly.containsLocation(location, this.polygon[i])) {
                this.cityIndex = i;
                this.isInZone = true
                break; // Exit the loop if the location is found within any polygon
              }
            }
            console.log(this.isInZone);
            console.log(this.cityIndex, "cityindex");

            if (!this.isInZone) {
              this.toaster.error('Service is not available');
              this.initMap();

            } else {
              this.toaster.success("Service is available");

              const matchedCity = this.citydata[this.cityIndex];
              const cityId = matchedCity._id;
              console.log("Matched City ID:", cityId);

              this._createrideservice.checkvehiclepricing({ city_id: cityId }).subscribe({
                next: (res: any) => {
                  if (res.success == false) {
                    this.toaster.error(res.message)
                    this.getroutebutton = true;

                  } else {
                    this.toaster.info(res.message)
                    this.getroutebutton = false;
                  }
                },
                error: (error) => {
                  console.error(error);
                },
              })

            }
          } else {
            alert('Select location from auto suggestion');
          }
        });
      }, 200)

    }

  }

  addWaypoint() {
    const waypoint = this.waypointInput?.nativeElement.value;
    if (waypoint) {
      this.stopsCounter++;
      this.waypoints.push(waypoint);
      this.waypointInput.nativeElement.value = ""; // Clear the input field
    }
  }

  removeWaypoint(index: number) {
    this.stopsCounter--;
    this.waypoints.splice(index, 1);
  }

  startInputChange() {
    // this.rideForm.patchValue({
    //   serviceType: "",
    // });
    this.startingplace = this.searchBoxRef?.nativeElement?.value;
    this.isInZone = true;
    if (this.startingplace != "") {
      this.location();
    }
  }

  getroute() {

    console.log(this.destinationplace);
    console.log(this.startingplace);

    if (this.startingplace && this.destinationplace) {
      const request = {
        origin: this.startingplace.geometry.location, // Ensure `this.startingplace` is a string
        destination: this.destinationplace.geometry.location,
        waypoints: this.waypoints.map((waypoint: any) => ({
          location: waypoint,
        })),
        optimizeWaypoints: true,
        travelMode: 'DRIVING',
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          this.drawRoute(result);
          this.directionsRenderer.setDirections(result)
          //   const distance = result.routes[0].legs[0].distance.text;
          //   const duration = result.routes[0].legs[0].duration.text;
          //   console.log('Distance:', distance);
          //   console.log('Duration:', duration);
        }
      });
    }
  }

  calculateFare(vehiclePricing: any, cityIndex: any) {
    // console.log(cityIndex);

    let minFare = +vehiclePricing.minfare;
    // console.log(minFare);
    let baseDistance = +vehiclePricing.distanceforbaseprice;
    let basePrice = +vehiclePricing.baseprice;
    let priceperunitdistance = +vehiclePricing.priceperunitdistance;
    let priceperunittime = +vehiclePricing.priceperunittime;

    // console.log(minFare, baseDistance, basePrice, priceperunitdistance, priceperunittime);
    let estimatePrice =
      (this.totalDistance - baseDistance) * priceperunitdistance +
      basePrice +
      this.totalTime * priceperunittime;
    if (estimatePrice < minFare || estimatePrice < basePrice) {
      estimatePrice = minFare;
    }

    this.estimateFare = estimatePrice;
    this.vehiclesPricing[cityIndex].estimateFare = estimatePrice;
    console.log(this.vehiclesPricing[cityIndex].estimateFare);

    console.log(estimatePrice);
  }

  getVehiclePricing(index: any) {
    console.log(index);

    const cityId = this.citydata[index]._id;
    console.log(cityId);

    this._createrideservice.getServiceType(cityId).subscribe({
      next: (vehiclesPricing: any) => {
        console.log(vehiclesPricing);
        this.vehiclesPricing = vehiclesPricing;

        // to calculate fare......
        this.vehiclesPricing.forEach((vehiclePricing: any, i: any) => {
          this.calculateFare(vehiclePricing, i);
        });
        console.log(this.vehiclesPricing);
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.error(error.message);
      },
    });
  }

  drawRoute(response: any) {
    const route = response.routes[0];

    let totalDistance = 0;
    for (let i = 0; i < route.legs.length; i++) {
      totalDistance += +route.legs[i].distance.value;
    }

    let totalDuration = 0;
    for (let i = 0; i < route.legs.length; i++) {
      const leg = route.legs[i];
      totalDuration += +leg.duration.value;
    }

    this.totalDistance = +totalDistance / 1000;
    this.totalDistance = this.totalDistance.toFixed(1);
    console.log("Total Distance:", this.totalDistance, "km");

    this.totalHours = Math.floor(totalDuration / 3600);
    console.log(this.totalHours);

    this.totalMinutes = Math.round((totalDuration % 3600) / 60);
    console.log(
      "Time:",
      this.totalHours,
      "hours",
      this.totalMinutes,
      "minutes"
    );
    this.estimateTime = this.totalHours + " hours " + this.totalMinutes + " minutes ";
    console.log(totalDuration);

    this.totalTime = +totalDuration / 60;
    this.totalTime = this.totalTime.toFixed(1);
    console.log(this.totalTime);
    console.log(this.estimateTime);


    this.getVehiclePricing(this.cityIndex);

    // Clear previous route
    this.directionsRenderer.setMap(null);
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    // Display new route
    this.directionsRenderer.setDirections(response);
  }

  selectvehicle(vehicletype: any) {
    console.log(vehicletype);
    this.vehicle_id = vehicletype;

    console.log(this.city_id);
    this.selectedvehicle = this.vehiclesPricing.find((price: any) => {
      // console.log(price.vehicle_id._id);
      return price.vehicle_id._id === vehicletype;
    });
    if (this.selectedvehicle) {
      this.selectedvehicle.totalDistance = this.totalDistance;
      this.selectedvehicle.totalTime = this.totalTime;
    } else {
      console.log("not match ");
    }
    this.city_id = this.selectedvehicle.city_id;
    // console.log( this.city_id );

    console.log(this.selectedvehicle);

  }

  selectpayment(payment: any) {
    // console.log(payment);
    this.paymentoptions = payment;
    console.log(this.paymentoptions);


  }
  getCurrentDateTime(): { date: string, time: string } {
    const now = new Date();
    const formattedDate = now.toISOString().substring(0, 10);
    const formattedTime = now.toTimeString().substring(0, 5);
    return { date: formattedDate, time: formattedTime };
  }


  selectridetime(ridetime: any) {
    this.ridetime = ridetime;
    console.log(this.ridetime);
    if (this.ridetime === 'bookNow') {
      const currentDateTime = this.getCurrentDateTime();
      this.createridesForm.patchValue({
        date: currentDateTime.date,
        time: currentDateTime.time

      });

    } else {
      // Clear the date and time values
      this.createridesForm.patchValue({
        date: '',
        time: ''
      });
    }

  }

  // searchphonenumber() {
  //   this.isButtonDisabled = true;
  //   this.getroutebutton = true;
  //   // console.log(this.search);
  //   const phoneNumber = this.createridesForm.get('phonenumber')?.value;
  //   // console.log(phoneNumber);

  //   this.userdatabasedata.forEach((user: any) => {
  //     if (user.userphonenumber == phoneNumber) {
  //       this.phonenumber = user.userphonenumber;
  //       this.user_id = user._id;
  //       console.log(this.user_id);

  //       this.phonenumberdatachecked = true;
  //       this.isButtonDisabled = false;
  //       this.getroutebutton = false;
  //       this.userdetailsform.patchValue({
  //         username: user.username,
  //         userphonenumber: user.userphonenumber,
  //         useremail: user.useremail,
  //       });
  //     }
  //   });
  // }

  getdetails() {
    const formvalue = this.createridesForm.value;
    const data = {
      phonenumber: formvalue.countrycode + formvalue.phonenumber
    }
    console.log(data);


    this._createrideservice.checkuserdetails(data).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.success == true) {
          this.toaster.success(res.message);
          this.isshow = true;
          this.userdetails = res.userdetails[0]
          console.log(this.userdetails);
          this.getroutebutton = false;
          this.user_id = this.userdetails._id
          this.userdetailsform.patchValue({
            username: this.userdetails.username,
            userphonenumber: this.userdetails.userphonenumber,
            useremail: this.userdetails.useremail,
          });

        } else {
          this.toaster.error(res.message);
          this.getroutebutton = true;
        }
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.error(error.message);
      },
    });
  }

  next() {
    console.log('hghghg');
    this.isshow = false;
    this.nextshow = true;
  }

  OnSubmit() {
    console.log(this.starting);
    console.log(this.destination);


    console.log("hello");
    console.log(this.createridesForm.value);

    const formValue = this.createridesForm.value;
    const createridedata: any = {
      paymentoption: formValue.paymentoption,
      ridetime: formValue.rideTime,
      date: formValue.date,
      time: formValue.time,
      vehicle_id: this.vehicle_id,
      user_id: this.user_id,
      city_id: this.selectedvehicle.city_id,
      startlocation: this.starting,
      destinationlocation: this.destination,
      waypoints: this.waypoints,
      totaldistance: this.totalDistance,
      totaltime: this.totalTime,
      estimatetime: this.estimateTime,
      estimatefare: this.selectedvehicle.estimateFare,
    };

    console.log(createridedata);
    this._createrideservice.addcreateride(createridedata).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toaster.success("Ride booked successfully!");
        this.createridesForm.reset();
        this.userdetailsform.reset();
      },
      error: (error: any) => {
        console.log(error);
        this.toaster.error(error.message);
      },
    });
  }

  getFormattedDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


}



    // waypoint(val: any) {
    //   const input_to = val.target;
    //   const autocomplete_to = new google.maps.places.Autocomplete(input_to);
    //   autocomplete_to.setFields(['formatted_address', 'geometry']);
    //   autocomplete_to.addListener('place_changed', () => {
    //     const place = autocomplete_to.getPlace();
    //     const place_name = place.formatted_address;
    //     // Do something with the selected place
    //   });
    // }

    // addItem() {
    //   const waypointControl = this.createridesForm.get('waypointlocation') as FormArray;

    //   if (waypointControl.length < +this.maximumstop) {
    //     waypointControl.push(this.formBuilder.group({
    //       name: ['']
    //     }));
    //   } else {
    //     this.toaster.error("You have no more stops!", "");
    //   }
    // }


    // onInputChange(value: string, index: number) {
    //   const inputId = 'waypointBox' + index;
    //   const inputElement = document.getElementById(inputId);

    //   const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    //     types: ['(cities)'], // Restrict results to cities
    //     componentRestrictions: { country: 'us' } // Restrict results to the United States (optional)
    //   });

    //   autocomplete.addListener('place_changed', () => {
    //     const place = autocomplete.getPlace();
    //     // Access the selected place object and perform actions with it
    //     console.log(place);
    //   });
    // }


    // getWaypointControls() {
    //   return (this.createridesForm.get('waypointlocation') as FormArray).controls;
    //  }

    // addwaypoint() {
    //   if (!this.stop) {
    //     this.stop = []; // Initialize the array if it is undefined
    //   }
    //   const waypointControl = this.createridesForm.get('waypointlocation') as FormArray;

    //   if (waypointControl.length < +this.maximumstop) {
    //     waypointControl.push(this.formBuilder.group({
    //       name: ['']
    //     }));

    //     const inputId = 'waypointBox' + waypointControl.length ; // Generate the ID of the new input element
    //     console.log(inputId);

    //     const input = document.getElementById(inputId);
    //     this.abcdautocomplete = new (google as any).maps.places.Autocomplete(input);
    //     this.abcdautocomplete.setFields(['geometry']);

    //     this.abcdautocomplete.addListener('place_changed', () => {
    //       const place = this.abcdautocomplete.getPlace();
    //       console.log(place);

    //     });
    //  const waypointBox = this.waypointBoxRef.nativeElement;
    // this.waypointAutocomplete = new google.maps.places.Autocomplete(
    //   inputId
    // );

    // this.waypointAutocomplete.setFields(['geometry']);
    // this.waypointAutocomplete.addListener('place_changed', () => {
    //   this.waypointplace = this.waypointAutocomplete.getPlace();
    //   console.log(this.waypointplace);
    // });
    //     console.log(waypointControl.length);

    //   }
    // }

