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
const routes: Routes = [
    {path: '', component: CustomerSearchComponent}
]
@NgModule({
    declarations: [CustomerSearchComponent],
    exports: [CustomerSearchComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        CapitalizeFirstPipeModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        [RouterModule.forChild(routes)]
    ]
})
export class CustomerSearchModule{}