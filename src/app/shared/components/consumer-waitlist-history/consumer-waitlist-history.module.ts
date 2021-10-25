import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CheckinHistoryListModule } from "../../modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.module";
import { HeaderModule } from "../../modules/header/header.module";
import { ConsumerWaitlistHistoryComponent } from "./consumer-waitlist-history.component";
const routes: Routes = [
    { path: '', component: ConsumerWaitlistHistoryComponent }
];
@NgModule({
    imports: [
        HeaderModule,
        CommonModule,
        CheckinHistoryListModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ConsumerWaitlistHistoryComponent],
    declarations: [ConsumerWaitlistHistoryComponent]
})
export class ConsumerWaitlistHistoryModule {}