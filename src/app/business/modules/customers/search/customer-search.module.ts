import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { CustomerSearchComponent } from "./customer-search.component";

@NgModule({
    declarations: [CustomerSearchComponent],
    exports: [CustomerSearchComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        CapitalizeFirstPipeModule,
        FormsModule
    ]
})
export class CustomerSearchModule{}