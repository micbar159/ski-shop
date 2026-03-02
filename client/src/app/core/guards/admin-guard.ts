import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../services/account';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notificationService';

export const adminGuard: CanActivateFn = (route, state) => {
  const accoutnService = inject(Account);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (accoutnService.isAdmin()) {
    return true;
  } else {
    notificationService.showError('Nope');
    router.navigateByUrl('/shop');
    return false;
  }  
};
