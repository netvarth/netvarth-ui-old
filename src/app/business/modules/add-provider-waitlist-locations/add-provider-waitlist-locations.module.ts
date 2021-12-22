import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { AddProviderWaitlistLocationsComponent } from "./add-provider-waitlist-locations.component";
import { AddProviderSchedulesModule } from "../add-provider-schedule/add-provider-schedule.module";

@NgModule({
    declarations: [AddProviderWaitlistLocationsComponent],
    exports: [AddProviderWaitlistLocationsComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FormMessageDisplayModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        LoadingSpinnerModule,
        AddProviderSchedulesModule
    ]
})
export class AddProviderWaitlistLocationsModule{}