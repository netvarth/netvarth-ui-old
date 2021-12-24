import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {MatTabsModule} from '@angular/material/tabs';
import {BookingHistoryComponent} from "./booking-history.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";

@NgModule({

    declarations: [BookingHistoryComponent],
    exports: [],
    imports: [
        CommonModule,
        MatTabsModule,
        CapitalizeFirstPipeModule
                ],

})
export class BookingHistoryModule{}