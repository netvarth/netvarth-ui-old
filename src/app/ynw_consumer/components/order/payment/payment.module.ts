import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { PaymentComponent } from "./payment.component";
const routes: Routes = [
    {path: '', component: PaymentComponent}
]
@NgModule({
    declarations: [PaymentComponent],
    exports: [PaymentComponent],
    imports: [
        CommonModule,
        HeaderModule,
        [RouterModule.forChild(routes)]
    ]
})
export class PaymentModule{}