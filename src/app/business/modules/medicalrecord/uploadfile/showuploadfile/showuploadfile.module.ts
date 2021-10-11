import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ShowuploadfileComponent } from "./showuploadfile.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [
        ShowuploadfileComponent
    ],
    declarations: [
        ShowuploadfileComponent
    ]
})
export class ShowuploadfileModule {}