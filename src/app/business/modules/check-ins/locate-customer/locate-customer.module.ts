import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LocateCustomerComponent } from './locate-customer.component';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    declarations: [
        LocateCustomerComponent
    ],
    exports: [LocateCustomerComponent]
})
export class LocateCustomerModule { }
