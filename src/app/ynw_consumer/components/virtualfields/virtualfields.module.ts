import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { VirtualFieldsComponent } from "./virtualfields.component";
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule
    ],
    declarations: [
        VirtualFieldsComponent
    ],
    exports: [
        VirtualFieldsComponent
    ]
})


export class VirtualFieldsModule{}