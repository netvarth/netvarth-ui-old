import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdermanagerComponent } from './ordermanager.component';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
  { path: '', component: OrdermanagerComponent },
  { path: 'items', loadChildren: () => import('./item/items.module').then(m => m.ItemsModule)},
  { path: 'catalogs', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule) },
  { path: 'storedetails', loadChildren: () => import('./store-details/store-details.module').then(m => m.StoreDetailsModule) },
];

@NgModule({
  imports: [
      CommonModule,
      MatDialogModule,
      MatSlideToggleModule,
      ShowMessagesModule,
      FormsModule,
      [RouterModule.forChild(routes)]
  ],
  declarations: [
    OrdermanagerComponent
  ],
  exports: [OrdermanagerComponent]
})
export class OrdermanagerModule { }
