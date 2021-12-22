import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { PagerModule } from "../../../shared/modules/pager/pager.module";
import { ProviderPaymentHistoryComponent } from "./provider-payment-history.component";
const routes: Routes = [
    {path: '', component: ProviderPaymentHistoryComponent}
]
@NgModule({
    declarations: [ProviderPaymentHistoryComponent],
    exports: [ProviderPaymentHistoryComponent],
    imports: [
        CommonModule,
        PagerModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ProviderPaymentHistoryModule{}