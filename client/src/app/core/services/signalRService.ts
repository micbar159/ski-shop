import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Order } from '../../shared/models/order';
import { NotificationService } from './notificationService';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  notificationService = inject(NotificationService);
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start()
        .catch(err => console.log(err));

      this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
        this.orderSignal.set(order);
        this.notificationService.showSuccess(`Your order: # ${order.id} has been paid.`)
      })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(err => console.log(err));
    }
  }
}
