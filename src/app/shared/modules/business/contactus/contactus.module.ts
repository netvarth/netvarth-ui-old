import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactusComponent } from './contactus.component';
import { HeaderModule } from '../../header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
    { path: '', component: ContactusComponent }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ContactusComponent
    ],
    entryComponents: [],
    exports: [ContactusComponent]
})
export class ContactusModule { }
