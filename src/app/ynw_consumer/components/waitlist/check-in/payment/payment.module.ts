import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { ConsumerPaymentComponent } from "./payment.component";
const routes: Routes = [
    { path: '', component: ConsumerPaymentComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        CommonModule,
        HeaderModule
    ],
    exports:[ConsumerPaymentComponent],
    declarations:[ConsumerPaymentComponent]
})
export class ConsumerCheckinPaymentModule{}