import { Component, inject, input, Input } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from "@angular/router";
import { MatIconButton, MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CurrencyPipe } from '@angular/common';
import { CdkAutofill } from "@angular/cdk/text-field";
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatIconButton,
    MatIcon,
    CurrencyPipe,
    MatAnchor,
    CdkAutofill
],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  item = input.required<CartItem>();
  private cartService = inject(CartService);

  removeProductFromCart() {
    return this.cartService.removeProductFromCart(this.item().productId);
  }

  increaseProductQuantiy() {
    return this.cartService.updateProductQuantity(this.item().productId, this.item().quantity + 1);
  }

  decreaseProductQuantiy() {
    return this.cartService.updateProductQuantity(this.item().productId, this.item().quantity - 1);
  }
}
