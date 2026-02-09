import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NotificationService } from '../services/notificationService';
import { CartService } from '../services/cart';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const notificationService = inject(NotificationService);
  const cartService = inject(CartService);

  if (cartService.cart()?.items) {
    return true;
  }

  notificationService.showError("Your cart is empty");
  return false;
};
