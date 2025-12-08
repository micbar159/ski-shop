import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  product?: Product;
  quantityInCart = 0;
  quantityToUpdate = 1;

  ngOnInit(): void {
    this.loadProduct();    
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: response => {
        this.product = response;
        this.loadQuantityInBasket();
      },
      error: er => console.log(er)
    });
  }

  loadQuantityInBasket() {
    this.quantityInCart = this.cartService
      .cart()?.items
      .find(i => i.productId === this.product?.id)?.quantity 
      ?? 0;

      if (this.quantityInCart !== 0) {
        this.quantityToUpdate = this.quantityInCart;
      }
  }

  getButtonText() {
    if (this.quantityInCart === 0)
      return "Add to cart";

    return "Update cart";
  }

  updateBasket() {
    if (!this.product) return;
    if (this.quantityInCart === 0) {
      this.cartService.addItemToCart(this.product, this.quantityToUpdate);
    } else {  
       this.cartService.updateProductQuantity(this.product.id, this.quantityToUpdate);    
    }

    this.quantityInCart = this.quantityToUpdate;
  }
}
