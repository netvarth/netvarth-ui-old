import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RouterModule, Routes } from "@angular/router";
import { LanguagesComponent } from "./languages.component";
const routes: Routes = [
    { path: '', component: LanguagesComponent }
]
@NgModule({
    declarations: [LanguagesComponent],
    exports: [LanguagesComponent],
    imports: [
        CommonModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ]
})
export class LanguagesModule {}