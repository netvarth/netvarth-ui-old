import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {MatTabsModule} from '@angular/material/tabs';
import {BookingHistoryComponent} from "./booking-history.component"
@NgModule({

    declarations: [BookingHistoryComponent],
    exports: [],
    imports: [
        CommonModule,
        MatTabsModule
                ],

})
export class BookingHistoryModule{}