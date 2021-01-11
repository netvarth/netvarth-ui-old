import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactusComponent } from './contactus.component';
import { contactusRoutingModule } from './contactus.routing.module';
// import { MaterialModule } from '../../../common/material.module';
import { FooterModule } from '../../footer/footer.module';
import { HeaderModule } from '../../header/header.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        // MaterialModule,
        FooterModule,
        contactusRoutingModule
    ],
    declarations: [
        ContactusComponent
    ],
    entryComponents: [],
    exports: [ContactusComponent]
})
export class ContactusModule { }
