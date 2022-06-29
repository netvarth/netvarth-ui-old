import { NgModule } from '@angular/core';
import { CatalogComponent } from './catalog.component';
import { CommonModule } from '@angular/common';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OrderModule } from 'ngx-order-pipe';
import { ServiceqrcodegeneratorModule } from '../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.module';

const routes: Routes = [
    { path: '', component: CatalogComponent },
    { path: ':id', loadChildren:()=> import('./details/catalog-details.module').then(m=>m.CatalogdetailModule) },
    { path: ':id/items', loadChildren:()=> import('./additems/add-items.module').then(m=>m.AddItemsModule) }
];

@NgModule({
    declarations: [
        CatalogComponent
      ],
    imports: [
        CommonModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ConfirmBoxModule,
        OrderModule,
        ServiceqrcodegeneratorModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [CatalogComponent]
})
export class CatalogModule {}
