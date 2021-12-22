import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { UpdateProfilePopupComponent } from "./update-profile-popup.component";

@NgModule({
    imports: [
        MatDialogModule,
        FormsModule,
        CommonModule,
        FormMessageDisplayModule
    ],
    declarations: [UpdateProfilePopupComponent],
    exports: [UpdateProfilePopupComponent]
})
export class UpdateProfilePopupModule {}