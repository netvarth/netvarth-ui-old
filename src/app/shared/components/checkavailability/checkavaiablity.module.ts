import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckavailabilityComponent } from "./checkavailability.component";
import { Nl2BrPipeModule } from 'nl2br-pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";


@NgModule({
    imports: [
        CommonModule,
        Nl2BrPipeModule,
        MatDatepickerModule,
        MatDialogModule
    ],
    exports: [ CheckavailabilityComponent ],
    declarations: [
        CheckavailabilityComponent
    
    ]
})
export class CheckavailabilityModule {}
