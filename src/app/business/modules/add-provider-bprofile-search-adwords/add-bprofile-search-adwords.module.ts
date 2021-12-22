import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { AddProviderBprofileSearchAdwordsComponent } from "./add-provider-bprofile-search-adwords.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        FormMessageDisplayModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [AddProviderBprofileSearchAdwordsComponent],
    declarations: [
        AddProviderBprofileSearchAdwordsComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class AddBprofileSearchAdwordsModule {}