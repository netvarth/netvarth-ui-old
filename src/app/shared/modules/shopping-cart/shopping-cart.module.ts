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
@NgModule({
    imports: [
      ShoppingCartRoutingModule,
      RouterModule,
      CommonModule,
      HeaderModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
    ],
    declarations: [ShoppingCartSharedComponent, AddItemNotesComponent],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
    ]
})

export class ShoppingCartModule {}
