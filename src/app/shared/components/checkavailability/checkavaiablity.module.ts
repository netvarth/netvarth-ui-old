import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckavailabilityComponent } from "./checkavailability.component";
import { Nl2BrPipeModule } from 'nl2br-pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";


@NgModule({
    imports: [
        CommonModule,
        Nl2BrPipeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatChipsModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        CapitalizeFirstPipeModule
    ],
    exports: [ CheckavailabilityComponent ],
    declarations: [
        CheckavailabilityComponent
    
    ]
})
export class CheckavailabilityModule {}
