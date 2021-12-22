import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddproviderAddonComponent } from "./add-provider-addons.component";

@NgModule({
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule
    ],
    exports: [AddproviderAddonComponent],
    declarations: [AddproviderAddonComponent]
})
export class AddProviderAddonsModule {}