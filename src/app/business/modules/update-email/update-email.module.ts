import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { UpdateEmailComponent } from "./update-email.component";

@NgModule({
    declarations: [UpdateEmailComponent],
    exports: [UpdateEmailComponent],
    imports: [
        CommonModule,
        FormsModule,
        FormMessageDisplayModule,
        MatDialogModule
    ]
})
export class UpdateEmailModule {}