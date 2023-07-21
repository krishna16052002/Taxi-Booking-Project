
import { Component, Inject,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  ridedata: any;
  userdetails: any;
  feedbackform!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ride,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(){

    this.ridedata = this.data.ride
    console.log(this.ridedata);
    this.userdetails = this.ridedata.userdata
    console.log(this.userdetails);

    this.feedbackform = this.formBuilder.group({
      name: ['' ],
      email: [''],
      message : ['']
    });
   this.feedbackform.patchValue({
    name: this.userdetails.username,
    email : this.userdetails.useremail
   })
  }
  feedback(){
    // const feedbackForm  = new FormData();
    // feedbackForm.append('message', this.feedbackform.value.message);
    const data = {
      feedback : this.feedbackform.value.message,
      _id : this.ridedata._id

    }
    this.dialogRef.close(data)
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
export interface ride {
  ride: String;
}
