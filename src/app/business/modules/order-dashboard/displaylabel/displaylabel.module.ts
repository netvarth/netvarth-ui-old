import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { DisplaylabelpopupComponent } from "./displaylabel.component";

@NgModule({
    declarations: [DisplaylabelpopupComponent],
    exports: [DisplaylabelpopupComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class DisplaylabelpopupModule{}