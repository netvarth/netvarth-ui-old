import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InboxListModule } from "../../../shared/modules/inbox/inbox-list/inbox-list.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { EnquiryComponent } from "./enquiry.component";
const routes: Routes = [
    {path: '', component: EnquiryComponent}
]
@NgModule({
    declarations: [EnquiryComponent],
    exports: [EnquiryComponent],
    imports: [
        CommonModule,
        InboxListModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ]
})
export class EnquiryModule {}