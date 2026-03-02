import { inject, Injectable } from '@angular/core';
import { CartService } from './cart';
import { asyncScheduler, forkJoin, Observable, of, scheduled, tap } from 'rxjs';
import { Account } from './account';
import { SignalRService } from './signalRService';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(Account);
  private signalRService = inject(SignalRService);

  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null)

    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo().pipe(
        tap(user => {
          if (user) {
            this.signalRService.createHubConnection();
          }
        })
      )
    });
  }
}
