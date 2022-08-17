
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { RequestDialogModule } from "../../modules/request-dialog/request-dialog.module";
import { VisualizeModule } from "../../modules/visualizer/visualize.module";
import { MediaService } from "../../services/media-service";
import { MeetService } from "../../services/meet-service";
import { TwilioService } from "../../services/twilio-service";
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { MeetRoomComponent } from "./meet-room.component";
const routes: Routes = [
    { path: '', component: MeetRoomComponent}
]
@NgModule({
    declarations: [
        MeetRoomComponent
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        VisualizeModule,
        RequestDialogModule,
        AddInboxMessagesModule,
        MatMenuModule,
        MatIconModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        MeetRoomComponent
    ],
    providers: [
        TwilioService,
        MeetService,
        MediaService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class MeetRoomModule {}