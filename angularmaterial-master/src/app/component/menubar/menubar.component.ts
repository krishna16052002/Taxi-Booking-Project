import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }
  constructor(public authservices : AuthService){}
}
