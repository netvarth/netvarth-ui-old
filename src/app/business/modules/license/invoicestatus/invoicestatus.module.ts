import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { InvoiceStatusComponent } from "./invoicestatus.component";
const routes: Routes = [
    {path:'', component: InvoiceStatusComponent}
]
@NgModule({
    declarations: [InvoiceStatusComponent],
    exports: [InvoiceStatusComponent],
    imports: [
        CommonModule,
        MatTooltipModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class InvoiceStatusModule{}