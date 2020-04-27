import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { LocateCustomerComponent } from './locate-customer.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        LocateCustomerComponent
    ],
    entryComponents: [
        LocateCustomerComponent
    ],
    exports: [LocateCustomerComponent]
})
export class LocateCustomerModule { }
