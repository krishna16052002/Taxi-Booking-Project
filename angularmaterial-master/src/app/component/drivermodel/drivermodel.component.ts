import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { VehicleService } from 'src/app/service/vehicle.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-drivermodel',
  templateUrl: './drivermodel.component.html',
  styleUrls: ['./drivermodel.component.css'],
})
export class DrivermodelComponent implements OnInit {
  vehicletype!: FormGroup<any>;
  dialogClosed: any;

  vehicle: any;
  vehicledata: any = [];
  vehiclename: any;
  constructor(
    private _vehicle: VehicleService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DrivermodelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverData
  ) {}
  ngOnInit(): void {
    this._vehicle.getvehicledata().subscribe((res) => {
      this.vehicledata = res;
      console.log(this.vehicledata);
    });
    this.vehicletype = this.formBuilder.group({
      vehicle_id: ['', [Validators.required]],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSelectedvehicle(value: string): void {
    this.vehicle = value;
    console.log(this.vehicle);

    this.vehicledata.map((vehicle: any) => {
      if (vehicle._id === value) {
        this.vehiclename = vehicle.vehiclename;
        console.log(this.vehiclename);
      }
    });
  }

  vehicledatasave() {
    this.dialogRef.close(this.vehicle);
  }
}
export interface DriverData {
  title: string;
  id: String;
}
