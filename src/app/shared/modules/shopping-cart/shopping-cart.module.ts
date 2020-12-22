import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart.routing.module';
import { ShoppingCartSharedComponent } from './shopping-cart.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderModule } from '../header/header.module';
import { AddItemNotesComponent } from './add-item-notes/add-item-notes.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddAddressComponent } from './checkout/add-address/add-address.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgBootstrapModule } from '../common/ngbootstrap.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../common/material.module';
@NgModule({
    imports: [
      ShoppingCartRoutingModule,
      RouterModule,
      CommonModule,
      HeaderModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatStepperModule,
      NgBootstrapModule,
      MatGridListModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
    ],
    exports: [
      ShoppingCartRoutingModule,
      RouterModule,
      CommonModule,
      HeaderModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatStepperModule,
      NgBootstrapModule,
      MaterialModule
    ],
    declarations: [ShoppingCartSharedComponent, AddItemNotesComponent, CheckoutComponent, AddAddressComponent],
    entryComponents: [
      AddItemNotesComponent,
      AddAddressComponent,
      ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
    ]
})

export class ShoppingCartModule {}
