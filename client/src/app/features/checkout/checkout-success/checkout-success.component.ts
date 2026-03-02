import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from "../../../shared/pipes/card-pipe";
import { OrderService } from '../../../core/services/orderService';

@Component({
  selector: 'app-checkout-success',
  imports: [
    RouterLink,
    MatButton,
    CurrencyPipe,
    AddressPipe,
    DatePipe,
    MatProgressSpinnerModule,
    CardPipe
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
  private orderService = inject(OrderService);

}
