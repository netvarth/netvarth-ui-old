import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MeetingRoomComponent } from "./meeting-room.component";

@NgModule({
    declarations: [
        MeetingRoomComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MeetingRoomComponent
    ]
})
export class MeetingRoomModule {}