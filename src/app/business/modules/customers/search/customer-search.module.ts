import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { CustomerSearchComponent } from "./customer-search.component";
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
        [RouterModule.forChild(routes)]
    ]
})
export class CustomerSearchModule{}