import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {

  requestNotificationPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }
}
