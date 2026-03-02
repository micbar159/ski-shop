import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { StripeService } from '../../core/services/stripeService';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { NotificationService } from '../../core/services/notificationService';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox'
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { Account } from '../../core/services/account';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CartService } from '../../core/services/cart';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/orderService';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    RouterLink,
    MatAnchor,
    RouterLink,
    MatButton,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinnerModule
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit{  
  private stripeService = inject(StripeService);
  private notificationService = inject(NotificationService);
  private accountService = inject(Account);
  private router = inject(Router);
  private orderService = inject(OrderService);
  cartService = inject(CartService)
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{address: boolean, payment: boolean, delivery: boolean}>(
    {address: false, payment: false, delivery: false}
  )
  confirmationToken?: ConfirmationToken;
  loading = false;
  
  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
      
    } catch (error: any) {
      this.notificationService.showError(error.message)
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.payment = event.complete;
      return state;
    })
  }

   handleDeliveryChange (event : boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })    
  }

  ngOnDestroy() {
    this.stripeService.disposeElements();
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeService.createConfirmationToken();       
        if (result.error) {
          throw new Error(result.error.message);
        }
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch(error: any) {
      this.notificationService.showError(error.message);
    }    
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1 ) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;
        if (address) {
          this.accountService.updateAddress(address).subscribe({
            error: ((err) => this.notificationService.showError(err))
          })
        }
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken);

        if (result.paymentIntent?.status === 'succeeded'){
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));
          if (orderResult) {
            this.orderService.orderComplete = true;
            this.cartService.deleteCart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl('/checkout/success');
          }
          else {
            throw new Error('Order creation failed');
          }
        } else if (result.error) {
          throw new Error(result.error.message)
        } else {
          throw new Error('Something went wrong');
        }
      }
    } catch (error: any) {
      this.notificationService.showError(error.message || 'Something went wrong');
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  private async createOrderModel() : Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error('Problem creating order');
    }

    const order: OrderToCreate = {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress
    }

    return order;
  }

  private async getAddressFromStripeAddress() : Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code
      }
    }

    return null;
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }
}
