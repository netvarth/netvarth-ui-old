import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterModule, Routes } from "@angular/router";
import { LivetrackService } from "../../../../../shared/services/livetrack-service";
import { ConfirmBoxModule } from "../../../../../shared/components/confirm-box/confirm-box.module";
import { HeaderModule } from "../../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConsumerLiveTrackComponent } from "./livetrack.component";
const routes: Routes = [
    { path: '', component: ConsumerLiveTrackComponent }
];
@NgModule({
    imports: [
        HeaderModule,
        CommonModule,
        MatSlideToggleModule,
        MatDialogModule,
        LoadingSpinnerModule,
        FormsModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        ConsumerLiveTrackComponent
    ],
    declarations: [
        ConsumerLiveTrackComponent
    ],
    providers: [
        LivetrackService
    ]
})
export class ConsumerLiveTrackModule {}