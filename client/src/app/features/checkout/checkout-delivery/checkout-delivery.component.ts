import { Component, inject, OnInit } from '@angular/core';
import { Checkout } from '../../../core/services/checkout';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';
import {FormsModule} from '@angular/forms';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss',
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(Checkout);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId)
          if (method) {
            this.cartService.selectedDelivery.set(method);
          }          
        }
      }
    });
  }  

  updateDeliveryMethod(deliveryMethod: DeliveryMethod) {
    this.cartService.selectedDelivery.set(deliveryMethod);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = deliveryMethod.id;
      this.cartService.setCart(cart);
    }
  }
}
