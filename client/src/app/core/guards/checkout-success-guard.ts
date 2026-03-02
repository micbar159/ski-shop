import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { OrderService } from '../services/orderService';

export const checkoutSuccessGuard: CanActivateFn = (route, state) => {
  const orderService = inject(OrderService);
  const router = inject(Router);

  if (orderService.orderComplete) {
    return true;
  }

  router.navigateByUrl('/shop');
  return false;
};
