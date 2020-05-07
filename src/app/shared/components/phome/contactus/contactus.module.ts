import { NgModule } from '@angular/core';
import { PhomeRoutingModule } from '../phome-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../../../modules/header/header.module';
import { MaterialModule } from '../../../modules/common/material.module';
import { FooterModule } from '../../../modules/footer/footer.module';
import { ContactusComponent } from './contactus.component';
import { contactusRoutingModule } from './contactus.routing.module';
@NgModule({
   
    imports: [
       
       CommonModule,
       FormsModule,
        HeaderModule,
       MaterialModule,
       FooterModule,
       contactusRoutingModule
    ],
    declarations: [
        ContactusComponent,

       
    ],
    entryComponents: [],
    exports: [ContactusComponent]
})
export class ContactusModule {} 
