import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MeetingDetailsComponent } from "./meeting-details.component";
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [MeetingDetailsComponent],
    declarations: [
        MeetingDetailsComponent
    ]
})
export class MeetingDetailsModule {}