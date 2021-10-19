import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { LanguagesComponent } from './languages.component';
const routes: Routes = [
    {path: '', component: LanguagesComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        LanguagesComponent
    ],
    exports: [LanguagesComponent]
})
export class LanguagesModule { }
