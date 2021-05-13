import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { MaterialModule } from "../../../shared/modules/common/material.module";
import { VirtualFieldsComponent } from "./virtualfields.component";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        MaterialModule
    ],
    declarations: [
        VirtualFieldsComponent
    ],
    entryComponents: [
        VirtualFieldsComponent
    ],
    exports: [
        VirtualFieldsComponent
    ]
})


export class VirtualFieldsModule{}