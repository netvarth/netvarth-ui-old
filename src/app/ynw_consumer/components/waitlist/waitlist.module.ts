import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterModule, Routes } from "@angular/router";
import { InboxListModule } from "../../../shared/modules/inbox/inbox-list/inbox-list.module";
import { AddInboxMessagesModule } from "../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { WaitlistComponent } from "./waitlist.component";
const routes: Routes = [
    { path: '', component: WaitlistComponent }
];
@NgModule({
    imports:[
        CommonModule,
        MatDialogModule,
        MatExpansionModule,
        AddInboxMessagesModule,
        MatExpansionModule,
        InboxListModule,
        [RouterModule.forChild(routes)]
    ],
    exports:[
        WaitlistComponent
    ],
    declarations: [
        WaitlistComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class WaitlistModule {}