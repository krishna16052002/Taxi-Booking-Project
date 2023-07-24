import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { loadStripe, } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent {
  selectddefaultid: any;
  defaultcardid: any;
  cardLists: any;
  AddCardUser: any;
  cardlist: any = true;
  stripe: any;
  cardElement: any;
  paymentElement: any;
  elements: any;
  addcard: any;
  userid: any;
  userdata: any;
  carddata: any;

  constructor(public dialogRef: MatDialogRef<StripeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: userdata, private http: HttpClient, private toster: ToastrService) { }


  async ngOnInit() {
    console.log(this.data);


    this.userdata = this.data.userdata;
    this.userid = this.userdata._id
    console.log(this.userdata);

    this.stripe = await loadStripe('pk_test_51NTisDLigteWfcRnZkQoTywuss8lTd3CUnil3xexs59lKQIlJcgEeJWCiMuExlDGlmtazauK0nBRj1hk6HoZOx9Q00Wt2DV8X0');
    this.elements = this.stripe.elements();


    this.cardElement = this.elements.create('card');

    this.cardElement.mount('#card-element');
    this.getCard(this.userid)


  }

  async addCard(id: any) {

    console.log(id);
      const paymentMethod = await this.stripe.createToken(
        this.cardElement,
      );
      const token = await paymentMethod.token
      console.log('succes: ',await  paymentMethod.token);
      const response = await fetch(`http://localhost:8080/create-intent/${id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({token})
      });

      this.getCard(this.userid);

  }

  getCard(userId: any) {
    this.http.get(`http://localhost:8080/get-card/${userId}`)
      .subscribe(
        (response:any) => {
          console.log(response);
            this.carddata = response;

          //  for (const paymentMethod of this.carddata) {
          //    if (paymentMethod.isDefault == true) {
          //      this.defaultcardid = paymentMethod.id;
          //        break;
          //    }
          //  }
        },
        (error:any) => {
          console.error('Error:', error);
        }
      );
  }

  async deleteCard(cardId: any) {
    const confirmDelete = confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      try {
        const response = await this.http.delete(`http://localhost:8080/delete-card/${cardId}`).toPromise();
        if (response) {
          this.getCard(this.userid);
          this.toster.success("Card deleted successfully!");
        } else {
          throw new Error("Failed to delete card");
        }
      } catch (error:any) {
        console.error(error);
        this.toster.error("Failed to delete card", "");
      }
    }
  }

  async SetDefault(customerId: any,cardId: any) {
    console.log(customerId);
    console.log(cardId);
    this.http
      .patch(`http://localhost:8080/default-card/${customerId}`, { cardId })
      .subscribe(
        (data:any) => {
          console.log(data);
          this.selectddefaultid = cardId;
           this.getCard(this.userid)
        },
        (error:any) => {
          console.error("Error:", error);
        }
      );
  }


  closeDialog(): void {
    this.dialogRef.close();
  }


}
export interface userdata {
  userdata: String;
}
