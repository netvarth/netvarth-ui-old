import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { CustomerSearchComponent } from "./customer-search.component";
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatOptionModule } from "@angular/material/core";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";


const routes: Routes = [
    {path: '', component: CustomerSearchComponent}
]
@NgModule({
    declarations: [CustomerSearchComponent],
    exports: [CustomerSearchComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        CapitalizeFirstPipeModule,
        FormsModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        [RouterModule.forChild(routes)]
    ]
})
export class CustomerSearchModule{}