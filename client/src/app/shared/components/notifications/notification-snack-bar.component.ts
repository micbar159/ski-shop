import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-notification',
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIcon],
  templateUrl: './notification-snack-bar.component.html',
  styleUrl: './notification-snack-bar.component.scss',
})

export class NotificationSnackBarComponent {
  constructor (@Inject(MAT_SNACK_BAR_DATA) public message: string) {}
  snackBarRef = inject(MatSnackBarRef);
}
