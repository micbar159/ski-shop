import { inject, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NotificationSnackBarComponent } from '../../shared/components/notifications/notification-snack-bar.component';

@Injectable({
  providedIn: 'root',
})

export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  showError(message: string){
    this._snackBar.openFromComponent(NotificationSnackBarComponent, {
      duration: 3000,
      data: message,
      panelClass: ['snack-error']
    })
  }

  showSuccess(message: string){
    this._snackBar.openFromComponent(NotificationSnackBarComponent, {
      duration: 3000,
      data: message,
      panelClass: ['snack-success']
    })
  }
}
