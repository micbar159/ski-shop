import { Directive, effect, inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Account } from '../../core/services/account';

@Directive({
  selector: '[appIsAdmin]' //*appIsAdmin
})
export class IsAdminDirective {
  private accoutnService = inject(Account);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  constructor() { 
    effect(() => {
      if (this.accoutnService.isAdmin()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }  else {
        this.viewContainerRef.clear();
      }
    });
  }
}
