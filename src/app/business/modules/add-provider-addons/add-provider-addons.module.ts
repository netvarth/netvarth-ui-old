import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddproviderAddonComponent } from "./add-provider-addons.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        MatInputModule
    ],
    exports: [AddproviderAddonComponent],
    declarations: [AddproviderAddonComponent],
    providers:[
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class AddProviderAddonsModule {}