import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { userContactInfoComponent } from "./user-contact-info.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatGridListModule,
        CommonModule,
        CapitalizeFirstPipeModule
    ],
    exports: [userContactInfoComponent],
    declarations: [userContactInfoComponent]
})
export class UserContactInfoModule {}