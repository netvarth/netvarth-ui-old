import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { AddInboxMessagesModule } from "../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { MeetingDetailsModule } from "../../meeting-details/meeting-details.module";
import { ActionPopupComponent } from "./action-popup.component";

@NgModule({
    imports:[
        MatDialogModule,
        CommonModule,
        MatGridListModule,
        MatFormFieldModule,
        MatInputModule,
        AddInboxMessagesModule,
        MeetingDetailsModule
    ],
    exports:[
        ActionPopupComponent
    ],
    declarations:[
        ActionPopupComponent
    ]
})
export class ActionPopupModule {}