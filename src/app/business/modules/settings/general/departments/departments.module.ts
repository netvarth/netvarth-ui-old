import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DepartmentsComponent } from "./departments.component";

@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule
    ],
    exports : [DepartmentsComponent],
    declarations: [DepartmentsComponent]
})
export class DepartmentsModule {}