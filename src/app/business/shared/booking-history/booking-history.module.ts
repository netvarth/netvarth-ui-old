import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {MatTabsModule} from '@angular/material/tabs';
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { BookingHistoryComponent } from "./booking-history.component";
@NgModule({

    declarations: [BookingHistoryComponent],
    exports: [BookingHistoryComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        CapitalizeFirstPipeModule
                ],

})
export class BookingHistoryModule{}