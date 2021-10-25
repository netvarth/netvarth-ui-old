import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { ConsumerAppointmentPaymentComponent } from "./payment.component";
const routes: Routes = [
    { path: '', component: ConsumerAppointmentPaymentComponent }
];
@NgModule({
    imports:[
        [RouterModule.forChild(routes)],
        CommonModule,
        HeaderModule
    ],
    exports:[
        ConsumerAppointmentPaymentComponent
    ],
    declarations:[
        ConsumerAppointmentPaymentComponent
    ]
})
export class ConsumerApptPaymentModule{}