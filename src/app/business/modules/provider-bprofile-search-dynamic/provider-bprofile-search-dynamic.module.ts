import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { DynamicFormModule } from "../../../shared/modules/dynamic-form/dynamic-form.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ProviderBprofileSearchDynamicComponent } from "./provider-bprofile-search-dynamic.component";

@NgModule({
    declarations: [ProviderBprofileSearchDynamicComponent],
    exports: [ProviderBprofileSearchDynamicComponent],
    imports: [
        CommonModule,
        FormMessageDisplayModule,
        MatDialogModule,
        DynamicFormModule
    ]
})
export class ProviderBprofileSearchDynamicModule {}