import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { SpentListComponent } from "./spent-list.component";

@NgModule({
    declarations: [SpentListComponent],
    exports: [SpentListComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class SpentListModule{}