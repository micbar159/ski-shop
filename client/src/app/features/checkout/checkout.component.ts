import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from "@angular/router";
import { MatAnchor, MatButton } from "@angular/material/button";
import { StripeService } from '../../core/services/stripeService';
import { StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
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
    CurrencyPipe
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit{  
  private stripeService = inject(StripeService);
  private notificationService = inject(NotificationService);
  private accountService = inject(Account);
  cartService = inject(CartService)
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{address: boolean, payment: boolean, delivery: boolean}>(
    {address: false, payment: false, delivery: false}
  )
  
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

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1 ) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
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
  }

  private async getAddressFromStripeAddress() : Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
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
