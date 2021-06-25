
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { VisualizeModule } from "../../../business/modules/visualizer/visualize.module";
import { TwilioService } from "../../services/twilio-service";
import { MeetRoomComponent } from "./meet-room.component";

@NgModule({
    declarations: [
        MeetRoomComponent
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        VisualizeModule
    ],
    exports: [
        MeetRoomComponent
    ],
    providers: [
        TwilioService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class MeetRoomModule {}