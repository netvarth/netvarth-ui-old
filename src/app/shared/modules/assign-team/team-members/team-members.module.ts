import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TeamMembersComponent } from "./team-members.component";

@NgModule({
    declarations: [TeamMembersComponent],
    exports: [TeamMembersComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class TeamMembersModule {}