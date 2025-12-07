import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { CartItemComponent } from "./cart-item/cart-item.component";

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
}
