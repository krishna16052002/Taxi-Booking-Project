import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {

//   requestNotificationPermission(): void {
//     if ('Notification' in window) {
//       Notification.requestPermission().then((permission) => {
//         console.log('Notification permission:', permission);
//       });
//     }
//   }

//   sendNotification(message: string): void {

//     if ('Notification' in window && Notification.permission === 'granted') {
//       const notification = new Notification('Push Notification', {
//         body: message,
//       });
//     }
//   }
}
