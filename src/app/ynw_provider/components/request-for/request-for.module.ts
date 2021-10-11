import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { RequestForComponent } from "./request-for.component";
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        FormMessageDisplayModule
    ],
    exports: [RequestForComponent],
    declarations: [
        RequestForComponent
    ]
})
export class RequestForModule {}