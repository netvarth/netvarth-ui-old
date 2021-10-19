import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterModule, Routes } from "@angular/router";
import { DepartmentsComponent } from "./departments.component";
const routes: Routes = [
    {path:'', component: DepartmentsComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    exports : [DepartmentsComponent],
    declarations: [DepartmentsComponent]
})
export class DepartmentsModule {}