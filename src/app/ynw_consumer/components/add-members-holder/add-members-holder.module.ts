import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { AddMemberModule } from "../../../shared/modules/add-member/add-member.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { AddMembersHolderComponent } from "./add-members-holder.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        AddMemberModule
    ],
    declarations: [
        AddMembersHolderComponent
    ],
    exports: [
        AddMembersHolderComponent
    ]
})
export class AddMembersHolderModule { }